import { type ConfigPlugin, withEntitlementsPlist } from "@expo/config-plugins";
import type { NSEPluginProps } from "../withNotificationsExtension";

/**
 * Add 'aps-environment' record with current environment to '<project-name>.entitlements' file
 * @see https://documentation.onesignal.com/docs/react-native-sdk-setup#step-4-install-for-ios-using-cocoapods-for-ios-apps
 */
const withApsEnvironment: ConfigPlugin<NSEPluginProps> = (
  config,
  { apsEnvironment },
) => {
  return withEntitlementsPlist(config, (newConfig) => {
    if (apsEnvironment == null) {
      throw new Error(`
        Missing required "apsEnvironment" key in your app.json or app.config.js file for "expo-notification-extension" plugin.
        "apsEnvironment" can be either "development" or "production".`);
    }

    newConfig.modResults["aps-environment"] = apsEnvironment;
    return newConfig;
  });
};
export default withApsEnvironment;
