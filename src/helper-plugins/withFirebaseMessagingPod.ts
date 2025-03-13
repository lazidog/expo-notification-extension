import { type ConfigPlugin, withPodfile } from "@expo/config-plugins";
import { EXTENSION_NAME } from "../constants";

export const FIREBASE_MESSAGING_POD = `

target '${EXTENSION_NAME}' do
  pod 'Firebase/Messaging'
  use_frameworks! :linkage => :static
end

`;

/**
 * 1. Add Firebase/Messaging pod to target extension because it process push notifications independently of the main app
 * 2. Add GoogleUtilities pod to all targets in the Podfile, ensuring compatibility with Firebase iOS SDKs.
 *    To fix build error [Multiple commands produce GoogleUtilities]
 *    ref: https://github.com/invertase/firestore-ios-sdk-frameworks/issues/72#issuecomment-1721456885
 */
const withFirebaseMessagingPod: ConfigPlugin = (config) => {
  return withPodfile(config, (podConfig) => {
    let contents = podConfig.modResults.contents + FIREBASE_MESSAGING_POD;

    // finds every 'target ${targetName} do' line in the Podfile, and add pod 'GoogleUtilities' right after it.
    const targetRegex = /(target\s+'[^']+'\s+do\s*?\n)/g;
    contents = contents.replace(targetRegex, "$1  pod 'GoogleUtilities'\n");

    podConfig.modResults.contents = contents;
    return podConfig;
  });
};

export default withFirebaseMessagingPod;
