#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import type { MCPServerConfig } from "./types.js";
import { ProjectInitializer } from "./project-initializer.js";

const SERVER_CONFIG: MCPServerConfig = {
  name: "mcp-project-initializer",
  version: "1.0.0",
  capabilities: {
    tools: true,
    prompts: false,
    resources: false,
  },
};

class MCPProjectInitializerServer {
  private server: Server;
  private projectInitializer: ProjectInitializer;

  constructor() {
    this.server = new Server(SERVER_CONFIG, {
      capabilities: {
        tools: {},
      },
    });

    this.projectInitializer = new ProjectInitializer();
    this.setupHandlers();
  }

  private setupHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "start_mcp_project",
          description: "Begin the interactive process of creating a new MCP server project",
          inputSchema: {
            type: "object",
            properties: {},
          },
        },
        {
          name: "set_project_name",
          description: "Set the name for the MCP server project",
          inputSchema: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description: "The project name (e.g., 'hello-world-mcp')",
              },
            },
            required: ["name"],
          },
        },
        {
          name: "set_project_directory",
          description: "Set the ABSOLUTE directory path where the project should be created",
          inputSchema: {
            type: "object",
            properties: {
              directory: {
                type: "string",
                description: "ABSOLUTE directory path where to create the project. Must start with '/' (e.g., '/Users/yourname/Projects', '/home/user/workspace'). Relative paths are NOT allowed.",
              },
            },
            required: ["directory"],
          },
        },
        {
          name: "set_project_technology",
          description: "Set the technology stack for the MCP server",
          inputSchema: {
            type: "object",
            properties: {
              technology: {
                type: "string",
                enum: ["typescript", "python"],
                description: "The technology to use for the MCP server",
              },
            },
            required: ["technology"],
          },
        },
        {
          name: "set_project_description",
          description: "Provide requirements for AI to generate a comprehensive Product Requirements Document (PRD)",
          inputSchema: {
            type: "object",
            properties: {
              description: {
                type: "string",
                description: "High-level overview of what the MCP server should accomplish. The AI will use this to generate a comprehensive PRD with detailed requirements, architecture, and implementation plan.",
              },
            },
            required: ["description"],
          },
        },
        {
          name: "add_project_documentation",
          description: "Add additional documentation, API specs, or links to the project",
          inputSchema: {
            type: "object",
            properties: {
              documentationUrls: {
                type: "array",
                items: { type: "string" },
                description: "URLs to API specs, documentation, or other references",
              },
              customContext: {
                type: "string",
                description: "Additional context, requirements, or documentation as text",
              },
            },
          },
        },
        {
          name: "setup_project_foundation",
          description: "Create the project structure with rules, documentation, and PRD",
          inputSchema: {
            type: "object",
            properties: {},
          },
        },
        {
          name: "generate_mcp_server",
          description: "Generate the complete MCP server implementation based on all gathered requirements",
          inputSchema: {
            type: "object",
            properties: {},
          },
        },
        {
          name: "confirm_and_proceed",
          description: "User explicitly confirms they want to proceed to the next step",
          inputSchema: {
            type: "object",
            properties: {
              confirmation: {
                type: "string",
                enum: ["YES", "PROCEED", "CONTINUE"],
                description: "User must explicitly type YES, PROCEED, or CONTINUE to confirm",
              },
            },
            required: ["confirmation"],
          },
        },
        {
          name: "get_conversation_status",
          description: "Get the current status of the project creation conversation",
          inputSchema: {
            type: "object",
            properties: {},
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "start_mcp_project":
            return await this.projectInitializer.startMCPProject();

          case "set_project_name":
            return await this.projectInitializer.setProjectName(args);

          case "set_project_directory":
            return await this.projectInitializer.setProjectDirectory(args);

          case "set_project_technology":
            return await this.projectInitializer.setProjectTechnology(args);

          case "set_project_description":
            return await this.projectInitializer.setProjectDescription(args);

          case "add_project_documentation":
            return await this.projectInitializer.addProjectDocumentation(args);

          case "setup_project_foundation":
            return await this.projectInitializer.setupProjectFoundation();

          case "generate_mcp_server":
            return await this.projectInitializer.generateMCPServer();

          case "confirm_and_proceed":
            return await this.projectInitializer.confirmAndProceed(args);

          case "get_conversation_status":
            return await this.projectInitializer.getConversationStatus();

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: `Error executing tool ${name}: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    });

  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}

async function main(): Promise<void> {
  const server = new MCPProjectInitializerServer();
  await server.run();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
  });
}