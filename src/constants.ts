export const EXTENSION_NAME = "NotificationService";
export const EXTENSION_FILES_PATH =
  "node_modules/@lazidog/expo-notification-extension/build/extension-files";

export const ENTITLEMENTS_FILE = `${EXTENSION_NAME}.entitlements`;
export const PLIST_FILE = `${EXTENSION_NAME}-Info.plist`;
export const SOURCE_FILE = `${EXTENSION_NAME}.m`;
export const HEADER_FILE = `${EXTENSION_NAME}.h`;
export const EXT_FILES = [
  ENTITLEMENTS_FILE,
  PLIST_FILE,
  SOURCE_FILE,
  HEADER_FILE,
];
export const DEFAULT_BUNDLE_VERSION = "1";
export const DEFAULT_BUNDLE_SHORT_VERSION = "1.0";

export const GROUP_IDENTIFIER_TEMPLATE_REGEX = /{{GROUP_IDENTIFIER}}/gm;
export const BUNDLE_SHORT_VERSION_TEMPLATE_REGEX = /{{BUNDLE_SHORT_VERSION}}/gm;
export const BUNDLE_VERSION_TEMPLATE_REGEX = /{{BUNDLE_VERSION}}/gm;

export const APP_GROUP_KEY = "com.apple.security.application-groups";
