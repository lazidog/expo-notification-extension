import { type ConfigPlugin, withDangerousMod } from "@expo/config-plugins";
import fs from "node:fs";
import path from "node:path";
import {
  BUNDLE_SHORT_VERSION_TEMPLATE_REGEX,
  BUNDLE_VERSION_TEMPLATE_REGEX,
  DEFAULT_BUNDLE_SHORT_VERSION,
  DEFAULT_BUNDLE_VERSION,
  ENTITLEMENTS_FILE,
  EXTENSION_FILES_PATH,
  EXTENSION_NAME,
  EXT_FILES,
  GROUP_IDENTIFIER_TEMPLATE_REGEX,
  PLIST_FILE,
} from "../constants";

const readFile = async (path: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    fs.readFile(path, "utf8", (err, data) => {
      if (err || !data) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });
};

const writeFile = async (path: string, contents: string): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    fs.writeFile(path, contents, "utf8", (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
};

const copyFile = async (path1: string, path2: string): Promise<void> => {
  const fileContents = await readFile(path1);
  await writeFile(path2, fileContents);
};

/**
 * 1. Copies predefined extension files into the iOS project folder.
 * 2. Updates the entitlements file with the correct App Group identifier for app-extension communication.
 * 3. Updates the extension's Info.plist with the app's bundle version and short version.
 */
const withCopyExtensionFiles: ConfigPlugin = (_config) => {
  return withDangerousMod(_config, [
    "ios",
    async (config) => {
      /** path to target folder: app/ios/{EXTENSION_NAME} */
      const targetPath = path.join(
        config.modRequest.projectRoot,
        "ios",
        EXTENSION_NAME
      );
      /** path to predefined extension files (e.g., NotificationService-Info.plist, NotificationService.m, ...) */
      const extFilesPath = path.resolve(EXTENSION_FILES_PATH);

      /* COPY EXTENSION FILES */
      fs.mkdirSync(`${targetPath}`, { recursive: true });
      for (let i = 0; i < EXT_FILES.length; i++) {
        const extFile = EXT_FILES[i];
        const targetFile = `${targetPath}/${extFile}`;
        await copyFile(`${extFilesPath}/${extFile}`, targetFile);
      }

      /* UPDATE ENTITLEMENTS FILES */
      const groupIdentifier = `group.${config.ios?.bundleIdentifier}.nse`;
      const entitlementsFilePath = `${targetPath}/${ENTITLEMENTS_FILE}`;
      let entitlementsFile = await readFile(entitlementsFilePath);
      entitlementsFile = entitlementsFile.replace(
        GROUP_IDENTIFIER_TEMPLATE_REGEX,
        groupIdentifier
      );

      await writeFile(entitlementsFilePath, entitlementsFile);

      /* UPDATE PLIST FILES */
      const bundleVersion = config.ios?.buildNumber ?? DEFAULT_BUNDLE_VERSION;
      const bundleShortVersion =
        config?.version ?? DEFAULT_BUNDLE_SHORT_VERSION;
      const plistFilePath = `${targetPath}/${PLIST_FILE}`;
      let plistFile = await readFile(plistFilePath);
      plistFile = plistFile.replace(
        BUNDLE_VERSION_TEMPLATE_REGEX,
        bundleVersion
      );
      plistFile = plistFile.replace(
        BUNDLE_SHORT_VERSION_TEMPLATE_REGEX,
        bundleShortVersion
      );

      await writeFile(plistFilePath, plistFile);
      return config;
    },
  ]);
};

export default withCopyExtensionFiles;
