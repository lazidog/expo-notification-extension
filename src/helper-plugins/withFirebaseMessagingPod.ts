import { type ConfigPlugin, withPodfile } from "@expo/config-plugins";
import { EXTENSION_NAME } from "../constants";

export const FIREBASE_MESSAGING_POD = `

target '${EXTENSION_NAME}' do
  pod 'GoogleUtilities'
  pod 'Firebase/Messaging'
  use_frameworks! :linkage => :static
end

`;

const withFirebaseMessagingPod: ConfigPlugin = (config) => {
  return withPodfile(config, (podConfig) => {
    podConfig.modResults.contents =
      podConfig.modResults.contents + FIREBASE_MESSAGING_POD;
    return podConfig;
  });
};

export default withFirebaseMessagingPod;
