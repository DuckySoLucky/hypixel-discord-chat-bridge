export type Requirement = {
  key: string;
  required: number;
  has: number;
  passed: boolean;
};

export type Requirements = {
  username: string;
  uuid: string;
  guildName: string;
  passed: boolean;
  requirementsPassed: boolean;
  requirements: Requirement[];
};
