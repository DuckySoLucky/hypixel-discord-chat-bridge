export interface UnwrappedSchema {
  schema: any;
  optional: boolean;
  nullable: boolean;
}

export interface ConfigMetadataDescription {
  description: string;
  rawDescription: string | undefined;
}

export interface ConfigMetadataDotPathDescription {
  dotPath: string;
  formattedDotPath: string;
  description: string;
  rawDescription: string | undefined;
}

export interface ConfigMetadata extends ConfigMetadataDotPathDescription {
  title: string;
  skip: boolean;
  default: any;
}

export interface AskMetadata {
  configMetadata: ConfigMetadata;
  optional: boolean;
  nullable: boolean;
}

export interface SchemaData {
  schema: any;
  path: string[];
  key: string;
}
