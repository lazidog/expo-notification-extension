import { type ConfigPlugin, withEntitlementsPlist } from "@expo/config-plugins";
import { APP_GROUP_KEY } from "../constants";

const withAppGroupPermissions: ConfigPlugin = (config) => {
  return withEntitlementsPlist(config, (newConfig) => {
    if (!Array.isArray(newConfig.modResults[APP_GROUP_KEY])) {
      newConfig.modResults[APP_GROUP_KEY] = [];
    }
    const modResultsArray = newConfig.modResults[
      APP_GROUP_KEY
    ] as Array<string>;
    const entitlement = `group.${newConfig?.ios?.bundleIdentifier || ""}.nse`;
    if (modResultsArray.indexOf(entitlement) !== -1) {
      return newConfig;
    }
    modResultsArray.push(entitlement);

    return newConfig;
  });
};

export default withAppGroupPermissions;
