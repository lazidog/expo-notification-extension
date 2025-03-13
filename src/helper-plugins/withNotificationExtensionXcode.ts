import { type ConfigPlugin, withXcodeProject } from "@expo/config-plugins";
import { EXTENSION_NAME, EXT_FILES } from "../constants";

/**
 * Add Xcode target for the extension
 * Create PBXGroup to organize the extension files in Xcode file explorer
 *
 */
const withNotificationExtensionXcode: ConfigPlugin = (config) => {
  return withXcodeProject(config, (newConfig) => {
    const pbxProject = newConfig.modResults;
    if (pbxProject.pbxTargetByName(EXTENSION_NAME)) {
      return newConfig;
    }

    // Create new PBXGroup for the extension
    const extGroup = pbxProject.addPbxGroup(
      [...EXT_FILES],
      EXTENSION_NAME,
      EXTENSION_NAME
    );
    /**
     * Add the new PBXGroup to the top level group.
     * This makes the files / folder appear in the file explorer in Xcode.
     */
    const groups = pbxProject.hash.project.objects.PBXGroup;
    // biome-ignore lint/complexity/noForEach: <explanation>
    Object.keys(groups).forEach((key) => {
      if (
        typeof groups[key] === "object" &&
        groups[key].name === undefined &&
        groups[key].path === undefined
      ) {
        pbxProject.addToPbxGroup(extGroup.uuid, key);
      }
    });

    // WORK AROUND for codeProject.addTarget BUG
    // Xcode projects don't contain these if there is only one target
    // An upstream fix should be made to the code referenced in this link:
    //   - https://github.com/apache/cordova-node-xcode/blob/8b98cabc5978359db88dc9ff2d4c015cba40f150/lib/pbxProject.js#L860
    const projObjects = pbxProject.hash.project.objects;
    projObjects.PBXTargetDependency = projObjects.PBXTargetDependency || {};
    projObjects.PBXContainerItemProxy = projObjects.PBXTargetDependency || {};

    const target = pbxProject.addTarget(
      EXTENSION_NAME,
      "app_extension",
      EXTENSION_NAME,
      `${newConfig.ios?.bundleIdentifier}.${EXTENSION_NAME}`
    );
    /**
     * Adds source file NotificationService.m to build phase to compile.
     * Without this phase, the code wouldn’t be compiled into an executable, and the extension would do nothing
     */
    pbxProject.addBuildPhase(
      ["NotificationService.m"],
      "PBXSourcesBuildPhase",
      "Sources",
      target.uuid
    );
    pbxProject.addBuildPhase(
      [],
      "PBXResourcesBuildPhase",
      "Resources",
      target.uuid
    );
    pbxProject.addBuildPhase(
      [],
      "PBXFrameworksBuildPhase",
      "Frameworks",
      target.uuid
    );

    const configurations = pbxProject.pbxXCBuildConfigurationSection();
    for (const key in configurations) {
      const buildSettingsObj = configurations[key].buildSettings;
      if (
        typeof buildSettingsObj !== "undefined" &&
        buildSettingsObj.PRODUCT_NAME === `"${EXTENSION_NAME}"`
      ) {
        buildSettingsObj.CODE_SIGN_ENTITLEMENTS = `${EXTENSION_NAME}/${EXTENSION_NAME}.entitlements`;
        buildSettingsObj.CODE_SIGN_STYLE = "Automatic";
      }
    }
    return newConfig;
  });
};

export default withNotificationExtensionXcode;
