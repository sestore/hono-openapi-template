import packageJSON from "../../package.json" with { type: "json" };

export const APP_METADATA = {
  NAME: packageJSON.name.replace(/-/g, " ").toUpperCase(),
  VERSION: packageJSON.version,
  DESCRIPTION: packageJSON.description,
} as const;
