import { type ConfigPlugin, withPlugins } from "@expo/config-plugins";
import withAppGroupPermissions from "./helper-plugins/withAppGroupPermissions";
import withApsEnvironment from "./helper-plugins/withApsEnvironment";
import withCopyExtensionFiles from "./helper-plugins/withCopyExtensionFiles";
import withEasAppExtension from "./helper-plugins/withEasAppExtension";
import withFirebaseMessagingPod from "./helper-plugins/withFirebaseMessagingPod";
import withNotificationExtensionXcode from "./helper-plugins/withNotificationExtensionXcode";
import withRemoteNotificationsPermissions from "./helper-plugins/withRemoteNotificationsPermissions";

export type NSEPluginProps = {
  apsEnvironment: "development" | "production";
};

const withNotificationExtension: ConfigPlugin<NSEPluginProps> = (
  config,
  props
) => {
  if (typeof props.apsEnvironment !== "string") {
    throw new Error(
      "NotificationsExtension Expo Plugin: 'apsEnvironment' must be a string."
    );
  }
  return withPlugins(config, [
    [withApsEnvironment, props],
    withRemoteNotificationsPermissions,
    withFirebaseMessagingPod,
    withAppGroupPermissions,
    withCopyExtensionFiles,
    withNotificationExtensionXcode,
    withEasAppExtension,
  ]);
};

export default withNotificationExtension;
