import { promises as fs } from "fs";
import path from "path";
import axios from "axios";
import { fileURLToPath } from "url";
import type { 
  ProjectConfig, 
  ProjectTemplate 
} from "./types.js";

interface ConversationState {
  step: 'started' | 'name_set' | 'directory_set' | 'technology_set' | 'description_set' | 'docs_added' | 'foundation_ready' | 'completed';
  projectName?: string;
  projectDirectory?: string;
  technology?: string;
  description?: string;
  documentationUrls?: string[] | undefined;
  customContext?: string | undefined;
  foundationSetup?: boolean;
  waitingForConfirmation?: boolean;
  lastAction?: string;
}

export class ProjectInitializer {
  private currentProject: ProjectConfig | null = null;
  private workingDirectory: string;
  private conversationState: ConversationState = { step: 'started' };

  constructor() {
    this.workingDirectory = process.cwd();
  }

  private async loadTemplate(templateName: string, variables: Record<string, string> = {}): Promise<string> {
    try {
      const currentModuleUrl = import.meta.url;
      const currentModulePath = fileURLToPath(currentModuleUrl);
      const currentDir = path.dirname(currentModulePath);
      const templatePath = path.join(currentDir, "templates", "project-files", templateName);
      
      let content = await fs.readFile(templatePath, "utf-8");
      
      // Replace template variables
      for (const [key, value] of Object.entries(variables)) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        content = content.replace(regex, value);
      }
      
      return content;
    } catch (error) {
      console.warn(`Failed to load template ${templateName}:`, error);
      throw new Error(`Template ${templateName} not found or could not be loaded`);
    }
  }

  async startMCPProject(): Promise<{ content: Array<{ type: string; text: string }> }> {
    this.conversationState = { step: 'started' };
    
    return {
      content: [
        {
          type: "text",
          text: `🚀 Welcome! I'll help you create a new MCP Server project.\n\n⚠️  **IMPORTANT**: This is an interactive process that requires your input for each step. Please do not proceed to the next step until I explicitly ask for it.\n\n📝 **Step 1**: What would you like to name your project?\n\n🔸 **ACTION REQUIRED**: Please use the \`set_project_name\` tool with your desired project name (e.g., 'hello-world-mcp', 'task-manager-mcp').\n\n❌ **Do not proceed** to other steps until you complete this one.`,
        },
      ],
    };
  }

  async setProjectName(args: unknown): Promise<{ content: Array<{ type: string; text: string }> }> {
    try {
      const config = this.validateNameInput(args);
      this.conversationState.projectName = config.name;
      this.conversationState.step = 'name_set';
      
      return {
        content: [
          {
            type: "text",
            text: `✅ Great! Project name set to: **${config.name}**\n\n📝 **Step 2**: Where would you like to create the project?\n\n🔸 **ACTION REQUIRED**: Please use the \`set_project_directory\` tool with an ABSOLUTE path:\n\n⚠️  **ABSOLUTE PATHS ONLY**:\n• ✅ "/Users/yourname/Projects" \n• ✅ "/home/user/workspace"\n• ✅ "/opt/projects"\n• ❌ "." (relative paths NOT allowed)\n• ❌ "./projects" (relative paths NOT allowed)\n• ❌ "../my-projects" (relative paths NOT allowed)\n\nThe project folder "${config.name}" will be created inside this directory.\n\n🛑 **STOP**: Do not proceed to technology selection until you complete this step.`,
          },
        ],
      };
    } catch (error) {
      return this.formatError(`Failed to set project name: ${error}`);
    }
  }

  async setProjectDirectory(args: unknown): Promise<{ content: Array<{ type: string; text: string }> }> {
    try {
      if (this.conversationState.step !== 'name_set') {
        return this.formatError('⚠️ STEP ORDER VIOLATION: You must complete the previous step first. Please set the project name using set_project_name before setting the directory.');
      }
      
      const config = this.validateDirectoryInput(args);
      this.conversationState.projectDirectory = config.directory;
      this.conversationState.step = 'directory_set';
      
      return {
        content: [
          {
            type: "text",
            text: `✅ Perfect! Project directory set to: **${config.directory}**\n\n📝 **Step 3**: Which technology would you like to use?\n\n🔸 **ACTION REQUIRED**: Please use the \`set_project_technology\` tool with one of these options:\n• **typescript** - For Node.js-based MCP servers\n• **python** - For Python-based MCP servers\n\n❌ **Do not proceed** to the next step until you make your technology choice.`,
          },
        ],
      };
    } catch (error) {
      return this.formatError(`Failed to set project directory: ${error}`);
    }
  }

  async setProjectTechnology(args: unknown): Promise<{ content: Array<{ type: string; text: string }> }> {
    try {
      if (this.conversationState.step !== 'directory_set') {
        return this.formatError('⚠️ STEP ORDER VIOLATION: You must complete the previous step first. Please set the project directory using set_project_directory before choosing technology.');
      }
      
      const config = this.validateTechnologyInput(args);
      this.conversationState.technology = config.technology;
      this.conversationState.step = 'technology_set';
      
      return {
        content: [
          {
            type: "text",
            text: `✅ Excellent! Technology set to: **${config.technology}**\n\n📝 **Step 4**: What should your MCP server accomplish?\n\n🔸 **ACTION REQUIRED**: Please use the \`set_project_description\` tool to provide a high-level overview. The AI will generate a comprehensive Product Requirements Document (PRD) from your input.\n\n**Examples of good input:**\n• "Help users manage and track daily tasks with reminders"\n• "Provide weather information and forecasts for any location"\n• "Generate and validate API documentation from code"\n\n💡 **Note**: You provide the basic concept - the AI will create detailed requirements, architecture, and implementation plans.\n\n❌ **Do not proceed** until you provide your project overview.`,
          },
        ],
      };
    } catch (error) {
      return this.formatError(`Failed to set technology: ${error}`);
    }
  }

  async setProjectDescription(args: unknown): Promise<{ content: Array<{ type: string; text: string }> }> {
    try {
      if (this.conversationState.step !== 'technology_set') {
        return this.formatError('⚠️ STEP ORDER VIOLATION: You must complete the previous step first. Please set the technology using set_project_technology before providing a description.');
      }
      
      const config = this.validateDescriptionInput(args);
      this.conversationState.description = config.description;
      this.conversationState.step = 'description_set';
      
      return {
        content: [
          {
            type: "text",
            text: `✅ Perfect! Description captured: **${config.description}**\n\n📝 **Step 5**: Do you have any additional documentation or specifications?\n\n🔸 **ACTION REQUIRED**: Please use the \`add_project_documentation\` tool if you have:\n• API specification URLs\n• Documentation links\n• Example data or schemas\n• Additional context as text\n\n💡 **Or if no additional documentation**: You can proceed directly to \`setup_project_foundation\` to continue.\n\n❌ **Do not proceed** until you explicitly choose one of these options.`,
          },
        ],
      };
    } catch (error) {
      return this.formatError(`Failed to set description: ${error}`);
    }
  }

  async addProjectDocumentation(args: unknown): Promise<{ content: Array<{ type: string; text: string }> }> {
    try {
      if (this.conversationState.step !== 'description_set') {
        return this.formatError('⚠️ STEP ORDER VIOLATION: You must complete the previous step first. Please set the project description using set_project_description before adding documentation.');
      }
      
      const config = this.validateDocumentationInput(args);
      this.conversationState.documentationUrls = config.documentationUrls;
      this.conversationState.customContext = config.customContext;
      this.conversationState.step = 'docs_added';
      
      let message = `✅ Documentation added!\n`;
      if (config.documentationUrls?.length) {
        message += `• URLs: ${config.documentationUrls.length} links provided\n`;
      }
      if (config.customContext) {
        message += `• Additional context: Provided\n`;
      }
      
      message += `\n🎯 **Ready for Setup!**\n\nI now have everything I need:\n`;
      message += `• **Project**: ${this.conversationState.projectName}\n`;
      message += `• **Technology**: ${this.conversationState.technology}\n`;
      message += `• **Purpose**: ${this.conversationState.description}\n`;
      if (this.conversationState.documentationUrls?.length || this.conversationState.customContext) {
        message += `• **Documentation**: Provided\n`;
      }
      
      message += `\n🔸 **CONFIRMATION REQUIRED**: Are you ready to proceed with setting up the project foundation?\n\nThis will create the project structure, development rules, and documentation.\n\n⚠️  **USER CONFIRMATION REQUIRED**: Please use the \`confirm_and_proceed\` tool with confirmation="YES" to proceed, OR use \`setup_project_foundation\` directly if you're ready.\n\n🛑 **STOP**: Do not proceed until you explicitly confirm or call the setup tool.`;
      
      return {
        content: [
          {
            type: "text",
            text: message,
          },
        ],
      };
    } catch (error) {
      return this.formatError(`Failed to add documentation: ${error}`);
    }
  }

  async confirmAndProceed(args: unknown): Promise<{ content: Array<{ type: string; text: string }> }> {
    try {
      const config = this.validateConfirmationInput(args);
      
      // Clear waiting state
      this.conversationState.waitingForConfirmation = false;
      this.conversationState.lastAction = `User confirmed with: ${config.confirmation}`;
      
      return {
        content: [
          {
            type: "text",
            text: `✅ **Confirmed with "${config.confirmation}"!** You can now proceed to the next step.\n\n🔸 **Next Action**: Please use the appropriate tool to continue (e.g., \`setup_project_foundation\` or \`generate_mcp_server\` depending on your current step).`,
          },
        ],
      };
    } catch (error) {
      return this.formatError(`Confirmation failed: ${error}`);
    }
  }

  async getConversationStatus(): Promise<{ content: Array<{ type: string; text: string }> }> {
    let status = "🗣️ **MCP Project Creation Status**\n\n";
    
    const steps = [
      { key: 'started', name: 'Project Creation Started', completed: this.conversationState.step !== 'started' },
      { key: 'name_set', name: 'Project Name', completed: !!this.conversationState.projectName, value: this.conversationState.projectName },
      { key: 'directory_set', name: 'Project Directory', completed: !!this.conversationState.projectDirectory, value: this.conversationState.projectDirectory },
      { key: 'technology_set', name: 'Technology Choice', completed: !!this.conversationState.technology, value: this.conversationState.technology },
      { key: 'description_set', name: 'Project Description', completed: !!this.conversationState.description, value: this.conversationState.description },
      { key: 'docs_added', name: 'Documentation Added', completed: this.conversationState.step === 'docs_added' || this.conversationState.step === 'foundation_ready' || this.conversationState.step === 'completed' },
      { key: 'foundation_ready', name: 'Project Foundation Setup', completed: this.conversationState.foundationSetup },
      { key: 'completed', name: 'MCP Server Generated', completed: this.conversationState.step === 'completed' },
    ];
    
    for (const step of steps) {
      const icon = step.completed ? "✅" : "⏳";
      status += `${icon} **${step.name}**`;
      if (step.value) {
        status += `: ${step.value}`;
      }
      status += "\n";
    }
    
    status += "\n**Current Step**: ";
    switch (this.conversationState.step) {
      case 'started':
        status += "Waiting for project name";
        break;
      case 'name_set':
        status += "Waiting for project directory";
        break;
      case 'directory_set':
        status += "Waiting for technology choice";
        break;
      case 'technology_set':
        status += "Waiting for project description";
        break;
      case 'description_set':
        status += "Waiting for documentation (or ready for setup)";
        break;
      case 'docs_added':
        status += "Ready for project foundation setup";
        break;
      case 'foundation_ready':
        status += "Ready to generate MCP server code";
        break;
      case 'completed':
        status += "Project completed!";
        break;
    }

    return {
      content: [
        {
          type: "text",
          text: status,
        },
      ],
    };
  }


  private async fetchTechnologyTemplate(technology: string): Promise<ProjectTemplate> {
    // This is a simplified implementation - in a real scenario, you'd fetch from
    // repositories like awesome-cursorrules or maintain your own template library
    const templates: Record<string, ProjectTemplate> = {
      typescript: {
        technology: "TypeScript",
        rulesUrl: "",
        documentationUrls: [
          "https://www.typescriptlang.org/docs/",
          "https://nodejs.org/en/docs/",
          "https://modelcontextprotocol.io/llms-full.txt",
        ],
        directories: ["src", "tests", "docs", ".vscode", ".windsurf"],
        files: [],
      },
      python: {
        technology: "Python",
        rulesUrl: "",
        documentationUrls: [
          "https://docs.python.org/3/",
          "https://modelcontextprotocol.io/llms-full.txt",
        ],
        directories: ["src", "tests", "docs", ".windsurf"],
        files: [],
      },
      mcp: {
        technology: "MCP (Model Context Protocol)",
        rulesUrl: "",
        documentationUrls: [
          "https://www.typescriptlang.org/docs/",
          "https://nodejs.org/en/docs/",
          "https://modelcontextprotocol.io/llms-full.txt",
          "https://modelcontextprotocol.io/docs/",
        ],
        directories: ["src", "tests", "docs", ".vscode", ".windsurf"],
        files: [],
      },
    };

    const template = templates[technology.toLowerCase()];
    if (!template) {
      // Return a generic template for unknown technologies with MCP best practices
      return {
        technology: technology,
        rulesUrl: "",
        documentationUrls: ["https://modelcontextprotocol.io/llms-full.txt"],
        directories: ["src", "docs", ".windsurf"],
        files: [],
      };
    }

    return template;
  }

  private async gatherExternalDocumentation(urls: string[]): Promise<void> {
    const docsDir = path.join(this.workingDirectory, "docs", "external");
    await fs.mkdir(docsDir, { recursive: true });

    // Always include critical MCP documentation
    await this.downloadEssentialMCPDocumentation(docsDir);

    // Download user-provided URLs
    for (const url of urls) {
      try {
        const response = await axios.get(url, { timeout: 10000 });
        const filename = this.generateFilenameFromUrl(url);
        const filepath = path.join(docsDir, filename);
        await fs.writeFile(filepath, response.data);
      } catch (error) {
        console.warn(`Failed to fetch documentation from ${url}:`, error);
      }
    }
  }

  private async downloadEssentialMCPDocumentation(docsDir: string): Promise<void> {
    const essentialDocs = [
      {
        url: "https://modelcontextprotocol.io/llms-full.txt",
        filename: "llms-full.txt",
        description: "MCP client compatibility matrix"
      }
    ];

    // Add technology-specific SDK documentation
    if (this.currentProject?.technology === 'typescript') {
      essentialDocs.push({
        url: "https://raw.githubusercontent.com/modelcontextprotocol/typescript-sdk/refs/heads/main/README.md",
        filename: "typescript-sdk-README.md", 
        description: "TypeScript SDK documentation"
      });
    } else if (this.currentProject?.technology === 'python') {
      essentialDocs.push({
        url: "https://raw.githubusercontent.com/modelcontextprotocol/python-sdk/refs/heads/main/README.md",
        filename: "python-sdk-README.md",
        description: "Python SDK documentation"
      });
    }

    // Download all essential documentation
    for (const doc of essentialDocs) {
      try {
        console.log(`Downloading ${doc.description}: ${doc.url}`);
        const response = await axios.get(doc.url, { timeout: 15000 });
        const targetPath = path.join(docsDir, doc.filename);
        await fs.writeFile(targetPath, response.data);
        console.log(`✓ Downloaded ${doc.filename}`);
      } catch (error) {
        console.warn(`Failed to download ${doc.description} from ${doc.url}:`, error);
      }
    }
  }

  private async createProjectStructure(template: ProjectTemplate): Promise<void> {
    // Create directories
    for (const dir of template.directories) {
      const dirPath = path.join(this.workingDirectory, dir);
      await fs.mkdir(dirPath, { recursive: true });
    }

    // Create basic files
    const basicFiles = [
      {
        path: ".gitignore",
        content: this.generateGitignore(template.technology),
      },
      {
        path: "README.md",
        content: await this.generateReadme(),
      },
      {
        path: "CLAUDE.md",
        content: await this.generateClaudeMd(template.technology),
      },
    ];

    for (const file of basicFiles) {
      const filepath = path.join(this.workingDirectory, file.path);
      await fs.writeFile(filepath, file.content);
    }

    // Create .windsurf/rules directory and files
    await this.createWindsurfRules(template.technology);
  }

  private generateFilenameFromUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      const pathSegments = urlObj.pathname.split("/").filter(Boolean);
      const filename = pathSegments[pathSegments.length - 1] || "documentation";
      return filename.includes(".") ? filename : `${filename}.txt`;
    } catch {
      return "documentation.txt";
    }
  }

  private generateGitignore(technology: string): string {
    const common = `# Dependencies
node_modules/
*.log
npm-debug.log*

# Build outputs
build/
dist/
*.tsbuildinfo

# Environment
.env
.env.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
`;

    const techSpecific: Record<string, string> = {
      typescript: `
# TypeScript
*.js.map
*.d.ts.map
`,
      python: `
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg
MANIFEST
`,
    };

    return common + (techSpecific[technology.toLowerCase()] || "");
  }

  private async generateReadme(): Promise<string> {
    const projectName = this.currentProject?.name || "Project";
    const description = this.currentProject?.description || "AI-powered project";
    
    return await this.loadTemplate("README.md", {
      projectName,
      description
    });
  }


  private async generateClaudeMd(technology: string): Promise<string> {
    const description = this.currentProject?.description || "AI-powered project";
    const technologySlug = technology.toLowerCase().replace(/[^a-z0-9]/g, '-');
    
    let mcpSpecificContent = '';
    if (technology === "MCP (Model Context Protocol)") {
      mcpSpecificContent = await this.loadTemplate("mcp-specific-content.md");
    }

    return await this.loadTemplate("CLAUDE.md", {
      description,
      technology,
      technologySlug,
      mcpSpecificContent
    });
  }

  private async createWindsurfRules(technology: string): Promise<void> {
    const windsurfDir = path.join(this.workingDirectory, ".windsurf");
    await fs.mkdir(windsurfDir, { recursive: true });

    const rulesDir = path.join(windsurfDir, "rules");
    await fs.mkdir(rulesDir, { recursive: true });

    // Create general development rules
    const generalRules = `---
    trigger: always_on
    ---
    
    # General Development Rules

## Code Quality
- Follow existing code conventions and patterns in the codebase
- Use TypeScript for type safety when applicable
- Write clear, self-documenting code
- Add comments only when the code intent is not obvious

## File Management
- NEVER create files unless absolutely necessary
- ALWAYS prefer editing existing files over creating new ones
- Follow the existing directory structure

## Testing
- Write tests for new functionality
- Run existing tests before submitting changes
- Follow the testing patterns already established in the codebase

## Security
- Never commit secrets, API keys, or sensitive data
- Validate all user inputs
- Follow security best practices for the technology stack
`;

    const mcpRules = technology === "MCP (Model Context Protocol)" ? `
# MCP Development Rules

## Architecture
- Use @modelcontextprotocol/sdk TypeScript SDK
- Implement STDIO transport for communication
- Follow MCP protocol specifications exactly
- No direct LLM API keys - use prompt/response pattern

## Implementation Patterns
- Start small and iterate on functionality
- Implement proper error handling for all MCP operations
- Use structured logging for debugging
- Validate all inputs from MCP clients

## Testing
- Use MCP Inspector tool for development testing
- Test with actual MCP clients (Claude.app, etc.)
- Test error scenarios and edge cases
- Validate resource access and tool execution

## Security
- Limit resource access appropriately
- Validate all tool inputs
- Implement proper permission checking
- Never expose sensitive system information
` : '';

    await fs.writeFile(path.join(rulesDir, "general.md"), generalRules);
    
    if (mcpRules) {
      await fs.writeFile(path.join(rulesDir, "mcp.md"), mcpRules);
    }

    // Create technology-specific rules
    const techRules = await this.generateTechnologyRules(technology);
    if (techRules) {
      const filename = technology.toLowerCase().replace(/[^a-z0-9]/g, '-') + ".md";
      await fs.writeFile(path.join(rulesDir, filename), techRules);
    }
  }

  async setupProjectFoundation(): Promise<{ content: Array<{ type: string; text: string }> }> {
    try {
      if (this.conversationState.step !== 'docs_added' && this.conversationState.step !== 'description_set') {
        return this.formatError('⚠️ STEP ORDER VIOLATION: You must complete the project description step first. Please use set_project_description before setting up the foundation.');
      }
      
      // If coming directly from description_set, automatically transition to docs_added
      if (this.conversationState.step === 'description_set') {
        this.conversationState.step = 'docs_added';
      }
      
      // Create the project config from conversation state
      if (!this.conversationState.projectName || !this.conversationState.projectDirectory || !this.conversationState.description || !this.conversationState.technology) {
        return this.formatError('Missing required project information. Please complete all previous steps.');
      }
      
      this.currentProject = {
        name: this.conversationState.projectName,
        description: this.conversationState.description,
        technology: this.conversationState.technology,
        documentationUrls: this.conversationState.documentationUrls,
        customContext: this.conversationState.customContext,
      };
      
      // Resolve the project directory path
      const baseDirectory = path.resolve(this.conversationState.projectDirectory);
      const projectDirectory = path.join(baseDirectory, this.currentProject.name);
      
      // Create project directory
      await fs.mkdir(projectDirectory, { recursive: true });
      
      // Update working directory to the project directory
      this.workingDirectory = projectDirectory;
      
      let result = `🚀 Setting up project foundation for: **${this.currentProject.name}**\n\n`;
      result += `📁 Creating project in: ${projectDirectory}\n\n`;
      
      // Fetch technology-specific context
      const template = await this.fetchTechnologyTemplate(this.currentProject.technology);
      result += `✓ Fetched ${this.currentProject.technology} best practices and rules\n`;
      
      // Create docs directory and download essential MCP documentation
      const docsDir = path.join(this.workingDirectory, "docs", "external");
      await fs.mkdir(docsDir, { recursive: true });
      await this.downloadEssentialMCPDocumentation(docsDir);
      result += `✓ Downloaded essential MCP documentation and SDK docs\n`;
      
      // Gather additional external documentation if provided
      if (this.currentProject.documentationUrls?.length) {
        await this.gatherExternalDocumentation(this.currentProject.documentationUrls);
        result += `✓ Downloaded ${this.currentProject.documentationUrls.length} additional documentation sources\n`;
      }
      
      // Create project structure
      await this.createProjectStructure(template);
      result += `✓ Created project directory structure\n`;
      
      // Generate PRD
      const prdContent = await this.generatePRDContent(true);
      const prdPath = path.join(this.workingDirectory, "PRD.md");
      await fs.writeFile(prdPath, prdContent);
      result += `✓ Generated Product Requirements Document\n`;
      
      this.conversationState.foundationSetup = true;
      this.conversationState.step = 'foundation_ready';
      
      result += `\n🎉 **Project foundation is ready!**\n\n`;
      result += `**Created files:**\n`;
      result += `• CLAUDE.md - AI development guidance\n`;
      result += `• .windsurf/rules/ - Development best practices\n`;
      result += `• PRD.md - Product Requirements Document\n`;
      result += `• Project structure and documentation\n\n`;
      result += `**Next step:** Ready to generate your MCP server implementation!\n\n`;
      result += `🔸 **CONFIRMATION REQUIRED**: Are you ready to generate the complete MCP server code?\n\n`;
      result += `⚠️  **USER CONFIRMATION REQUIRED**: Please use the \`confirm_and_proceed\` tool with confirmation="YES" to proceed, OR use \`generate_mcp_server\` directly if you're ready.\n\n`;
      result += `🛑 **STOP**: Do not proceed until you explicitly confirm or call the generation tool.`;
      
      return {
        content: [
          {
            type: "text",
            text: result,
          },
        ],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return this.formatError(`Failed to setup project foundation: ${errorMessage}`);
    }
  }
  
  async generateMCPServer(): Promise<{ content: Array<{ type: string; text: string }> }> {
    try {
      if (this.conversationState.step !== 'foundation_ready') {
        return this.formatError('Please setup the project foundation first using setup_project_foundation.');
      }
      
      if (!this.currentProject) {
        return this.formatError('No project configuration found.');
      }
      
      let result = `🚀 **Project Context Prepared for AI Implementation!**\n\n`;
      
      // Generate configuration files only (no implementation code)
      const packageJson = await this.generatePackageJson();
      const tsConfig = this.currentProject.technology === 'typescript' ? await this.generateTsConfig() : null;
      
      // Save configuration files
      if (this.currentProject.technology === 'typescript') {
        await fs.writeFile(path.join(this.workingDirectory, 'package.json'), packageJson);
        if (tsConfig) {
          await fs.writeFile(path.join(this.workingDirectory, 'tsconfig.json'), tsConfig);
        }
      } else {
        await fs.writeFile(path.join(this.workingDirectory, 'requirements.txt'), this.generatePythonRequirements());
        await fs.writeFile(path.join(this.workingDirectory, 'pyproject.toml'), await this.generatePyProjectToml());
      }
      
      // Create implementation guidance document
      const implementationGuide = await this.generateImplementationGuide();
      await fs.writeFile(path.join(this.workingDirectory, 'IMPLEMENTATION.md'), implementationGuide);
      
      this.conversationState.step = 'completed';
      
      result += `✓ Generated project configuration files\n`;
      result += `✓ Created comprehensive implementation guidance\n`;
      result += `✓ Prepared all context files for AI development\n`;
      result += `✓ Applied all development best practices\n\n`;
      
      result += `🎯 **Your Project is Ready for AI Implementation!**\n\n`;
      
      result += `**Context Files Created:**\n`;
      result += `• PRD.md - Complete project requirements and specifications\n`;
      result += `• IMPLEMENTATION.md - Detailed implementation guidance for AI\n`;
      result += `• CLAUDE.md - AI development instructions and context file list\n`;
      result += `• .windsurf/rules/ - Development standards and coding best practices\n`;
      result += `• docs/external/ - API documentation and MCP compatibility info\n`;
      result += `• ${this.currentProject.technology === 'typescript' ? 'package.json & tsconfig.json' : 'requirements.txt & pyproject.toml'} - Project configuration\n\n`;
      
      result += `**What your MCP server should do:**\n`;
      result += `${this.currentProject.description}\n\n`;
      
      result += `**🤖 Next Steps for AI Implementation:**\n`;
      result += `1. **Read all context files** - Start with CLAUDE.md for the complete file list\n`;
      result += `2. **Review IMPLEMENTATION.md** - Contains specific guidance for implementing your MCP server\n`;
      result += `3. **Follow the PRD.md** - Contains complete functional requirements\n`;
      result += `4. **Apply coding standards** - Use rules from .windsurf/rules/\n`;
      result += `5. **Implement with creativity** - Use AI knowledge to create the best solution\n`;
      result += `6. **Test thoroughly** - Follow testing patterns from the rules\n\n`;
      
      result += `🎉 **The AI can now implement a custom, high-quality MCP server based on your requirements!**\n\n`;
      
      result += `💡 **Tip**: This approach allows the AI to use its full knowledge and creativity to implement your specific requirements, rather than following a rigid template.`;
      
      return {
        content: [
          {
            type: "text",
            text: result,
          },
        ],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return this.formatError(`Failed to prepare project for AI implementation: ${errorMessage}`);
    }
  }

  private validateNameInput(args: unknown): { name: string } {
    if (!args || typeof args !== "object") {
      throw new Error("Project name is required");
    }
    
    const cfg = args as Record<string, unknown>;
    if (typeof cfg["name"] !== "string" || !cfg["name"].trim()) {
      throw new Error("Project name must be a non-empty string");
    }
    
    return { name: cfg["name"].trim() };
  }
  
  private validateTechnologyInput(args: unknown): { technology: string } {
    if (!args || typeof args !== "object") {
      throw new Error("Technology choice is required");
    }
    
    const cfg = args as Record<string, unknown>;
    if (typeof cfg["technology"] !== "string" || !["typescript", "python"].includes(cfg["technology"])) {
      throw new Error("Technology must be either 'typescript' or 'python'");
    }
    
    return { technology: cfg["technology"] };
  }
  
  private validateDescriptionInput(args: unknown): { description: string } {
    if (!args || typeof args !== "object") {
      throw new Error("Project description is required");
    }
    
    const cfg = args as Record<string, unknown>;
    if (typeof cfg["description"] !== "string" || !cfg["description"].trim()) {
      throw new Error("Project description must be a non-empty string");
    }
    
    return { description: cfg["description"].trim() };
  }
  
  private validateDirectoryInput(args: unknown): { directory: string } {
    if (!args || typeof args !== "object") {
      throw new Error("Project directory is required");
    }
    
    const cfg = args as Record<string, unknown>;
    if (typeof cfg["directory"] !== "string" || !cfg["directory"].trim()) {
      throw new Error("Project directory must be a non-empty string");
    }
    
    const directory = cfg["directory"].trim();
    
    // Strictly require absolute paths
    if (!path.isAbsolute(directory)) {
      throw new Error(`❌ ABSOLUTE PATH REQUIRED: "${directory}" is not an absolute path. Please provide a path starting with "/" (e.g., "/Users/yourname/Projects", "/home/user/workspace")`);
    }
    
    return { directory };
  }
  
  private validateConfirmationInput(args: unknown): { confirmation: string } {
    if (!args || typeof args !== "object") {
      throw new Error("Confirmation is required. Please provide confirmation='YES', 'PROCEED', or 'CONTINUE'");
    }
    
    const cfg = args as Record<string, unknown>;
    if (typeof cfg["confirmation"] !== "string") {
      throw new Error("Confirmation must be a string. Use 'YES', 'PROCEED', or 'CONTINUE'");
    }
    
    const confirmation = cfg["confirmation"].trim().toUpperCase();
    if (!["YES", "PROCEED", "CONTINUE"].includes(confirmation)) {
      throw new Error(`Invalid confirmation: "${cfg["confirmation"]}". You must explicitly type "YES", "PROCEED", or "CONTINUE"`);
    }
    
    return { confirmation };
  }
  
  private validateDocumentationInput(args: unknown): { documentationUrls?: string[]; customContext?: string } {
    const result: { documentationUrls?: string[]; customContext?: string } = {};
    
    if (args && typeof args === "object") {
      const cfg = args as Record<string, unknown>;
      
      if (Array.isArray(cfg["documentationUrls"])) {
        result.documentationUrls = cfg["documentationUrls"].filter((url): url is string => typeof url === "string");
      }
      
      if (typeof cfg["customContext"] === "string" && cfg["customContext"].trim()) {
        result.customContext = cfg["customContext"].trim();
      }
    }
    
    return result;
  }
  
  private formatError(message: string): { content: Array<{ type: string; text: string }> } {
    return {
      content: [
        {
          type: "text",
          text: `❌ **Error**: ${message}`,
        },
      ],
    };
  }

  private async generatePRDContent(includeContext: boolean): Promise<string> {
    if (!this.currentProject) {
      throw new Error("No project initialized");
    }

    const project = this.currentProject;
    
    let additionalContext = '';
    if (project.customContext) {
      additionalContext = `**Additional Context**: ${project.customContext}\n\n`;
    }

    let externalDocumentationSection = '';
    if (includeContext && project.documentationUrls?.length) {
      externalDocumentationSection = `## External Documentation References\n\n`;
      for (const url of project.documentationUrls) {
        externalDocumentationSection += `- ${url}\n`;
      }
      externalDocumentationSection += "\n";
    }

    return await this.loadTemplate("PRD.md", {
      projectName: project.name,
      technology: project.technology,
      description: project.description,
      additionalContext,
      externalDocumentationSection
    });
  }

  private async generateImplementationGuide(): Promise<string> {
    if (!this.currentProject) {
      throw new Error("No project configuration found");
    }
    
    const { name, description, technology } = this.currentProject;
    const technologySlug = technology.toLowerCase().replace(/[^a-z0-9]/g, '-');
    
    // Load technology-specific instructions
    let technologySpecificInstructions = '';
    try {
      if (technology === 'typescript') {
        technologySpecificInstructions = await this.loadTemplate("typescript-instructions.md", {
          projectName: name
        });
      } else if (technology === 'python') {
        technologySpecificInstructions = await this.loadTemplate("python-instructions.md", {
          projectName: name
        });
      }
    } catch (error) {
      console.warn(`Failed to load technology-specific instructions for ${technology}:`, error);
    }
    
    return await this.loadTemplate("IMPLEMENTATION.md", {
      projectName: name,
      technology,
      technologySlug,
      description,
      technologySpecificInstructions
    });
  }

  private generatePythonRequirements(): string {
    return `# MCP Python Requirements
mcp>=1.0.0

# Development dependencies
pytest>=7.0.0
pytest-asyncio>=0.21.0
black>=23.0.0
isort>=5.12.0
mypy>=1.0.0
`;
  }

  private async generateTechnologyRules(technology: string): Promise<string | null> {
    try {
      // First try to read from local template files
      const currentModuleUrl = import.meta.url;
      const currentModulePath = fileURLToPath(currentModuleUrl);
      const currentDir = path.dirname(currentModulePath);
      const templatePath = path.join(currentDir, "templates", "rules", `${technology.toLowerCase()}.md`);
      
      try {
        const content = await fs.readFile(templatePath, "utf-8");
        return content;
      } catch {
        // If local template doesn't exist, fall back to hardcoded rules for MCP
        if (technology.toLowerCase() === "mcp (model context protocol)") {
          return `# MCP Development Rules

See mcp.md for detailed MCP-specific rules.
`;
        }
        return null;
      }
    } catch (error) {
      console.warn(`Failed to load technology rules for ${technology}:`, error);
      return null;
    }
  }

  private async generatePackageJson(): Promise<string> {
    if (!this.currentProject) {
      throw new Error("No project configuration found");
    }
    
    const { name, description, technology } = this.currentProject;
    
    if (technology === 'typescript') {
      return JSON.stringify({
        "name": name,
        "version": "1.0.0",
        "description": description,
        "main": "build/index.js",
        "type": "module",
        "bin": {
          [name]: "./build/index.js"
        },
        "scripts": {
          "build": "tsc",
          "dev": "tsc --watch",
          "start": "node build/index.js",
          "test": "jest",
          "clean": "rm -rf build/",
          "lint": "eslint src/**/*.ts",
          "typecheck": "tsc --noEmit"
        },
        "keywords": ["mcp", "ai", "assistant", "typescript"],
        "author": "",
        "license": "MIT",
        "dependencies": {
          "@modelcontextprotocol/sdk": "^1.0.0"
        },
        "devDependencies": {
          "@types/node": "^22.0.0",
          "@types/jest": "^29.0.0",
          "@typescript-eslint/eslint-plugin": "^8.0.0",
          "@typescript-eslint/parser": "^8.0.0",
          "eslint": "^9.0.0",
          "jest": "^29.0.0",
          "ts-jest": "^29.0.0",
          "typescript": "^5.6.0"
        },
        "engines": {
          "node": ">=18.0.0"
        }
      }, null, 2);
    } else {
      // For Python, this returns requirements.txt content
      return this.generatePythonRequirements();
    }
  }
  
  private async generateTsConfig(): Promise<string> {
    return JSON.stringify({
      "compilerOptions": {
        "target": "ES2022",
        "module": "ESNext",
        "moduleResolution": "node",
        "outDir": "./build",
        "rootDir": "./src",
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true,
        "declaration": true,
        "declarationMap": true,
        "sourceMap": true,
        "noUncheckedIndexedAccess": true,
        "exactOptionalPropertyTypes": true
      },
      "include": ["src/**/*"],
      "exclude": ["node_modules", "build", "tests"]
    }, null, 2);
  }
  
  private async generatePyProjectToml(): Promise<string> {
    if (!this.currentProject) {
      throw new Error("No project configuration found");
    }
    
    const { name, description } = this.currentProject;
    
    return `[build-system]
requires = ["setuptools>=61.0", "wheel"]
build-backend = "setuptools.build_meta"

[project]
name = "${name}"
version = "1.0.0"
description = "${description}"
readme = "README.md"
requires-python = ">=3.8"
classifiers = [
    "Development Status :: 4 - Beta",
    "Intended Audience :: Developers",
    "License :: OSI Approved :: MIT License",
    "Operating System :: OS Independent",
    "Programming Language :: Python :: 3",
    "Programming Language :: Python :: 3.8",
    "Programming Language :: Python :: 3.9",
    "Programming Language :: Python :: 3.10",
    "Programming Language :: Python :: 3.11",
    "Programming Language :: Python :: 3.12",
]
dependencies = [
    "mcp>=1.0.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=7.0.0",
    "pytest-asyncio>=0.21.0",
    "black>=23.0.0",
    "isort>=5.12.0",
    "mypy>=1.0.0",
]

[project.scripts]
${name} = "main:main"

[tool.setuptools.packages.find]
where = ["."]
include = ["main*"]

[tool.black]
line-length = 88
target-version = ["py38"]

[tool.isort]
profile = "black"

[tool.mypy]
python_version = "3.8"
warn_return_any = true
warn_unused_configs = true
disallow_untyped_defs = true
`;
  }

  // Removed template-based server code generation methods
  // The AI will now implement the server using its own knowledge and creativity
}
