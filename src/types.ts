export interface ProjectConfig {
  name: string;
  description: string;
  technology: string;
  documentationUrls?: string[] | undefined;
  customContext?: string | undefined;
}

export interface InitializationStep {
  name: string;
  description: string;
  completed: boolean;
}

export interface GeneratedDocument {
  filename: string;
  content: string;
  path: string;
}

export interface ProjectTemplate {
  technology: string;
  rulesUrl: string;
  documentationUrls: string[];
  directories: string[];
  files: GeneratedDocument[];
}

export interface MCPServerConfig {
  [x: string]: unknown;
  name: string;
  version: string;
  capabilities: {
    tools: boolean;
    prompts: boolean;
    resources: boolean;
  };
}