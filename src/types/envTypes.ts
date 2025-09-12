export interface EnvValue {
  id: string;
  value: string;
  description?: string;
  createdAt: Date;
}

export interface EnvKey {
  name: string;
  values: EnvValue[];
}

export interface AddEnvKeyInput {
  name: string;
  value: string;
  description?: string;
}
