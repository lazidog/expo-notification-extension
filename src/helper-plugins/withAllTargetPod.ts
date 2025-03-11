import { withPodfile } from "@expo/config-plugins";

// https://github.com/invertase/firestore-ios-sdk-frameworks/issues/72#issuecomment-1721456885
const withAllTargetPod = (config) => {
  return withPodfile(config, (podConfig) => {
    let contents = podConfig.modResults.contents;
    const targetRegex = /(target\s+'[^']+'\s+do\s*?\n)/g;
    contents = contents.replace(targetRegex, "$1  pod 'GoogleUtilities'\n");

    podConfig.modResults.contents = contents;
    return podConfig;
  });
};

export default withAllTargetPod;
