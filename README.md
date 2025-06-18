# MCP Project Initializer

An intelligent MCP (Model Context Protocol) server that automates the setup of new AI-powered MCP server development projects. This tool acts as a conversational guide through any standard MCP client to set up projects with necessary context, rules, and documentation for AI-assisted development.

## Features

- 🤖 **Conversational Project Setup** - Interactive step-by-step project initialization
- 📋 **AI-Enhanced PRD Generation** - Transform basic concepts into comprehensive specifications  
- 🔧 **Technology-Specific Context** - Automatically downloads SDK documentation and best practices
- 📚 **Development Rules Integration** - Includes coding standards and AI-optimized guidelines
- 🎯 **Context-Based Development** - Prepares projects for AI agents to implement with creativity
- 🛡️ **MCP Protocol Compliant** - Full compatibility with MCP clients and standards

## Quick Start

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd mcp-initializer

# Install dependencies
npm install

# Build the project
npm run build
```

### Using with MCP Clients

#### Windsurf IDE Configuration

Add this server to your Windsurf MCP settings:

```json
{
  "mcpServers": {
    "mcp-project-initializer": {
      "command": "node",
      "args": ["/path/to/mcp-initializer/build/index.js"],
      "description": "AI-powered project initialization server"
    }
  }
}
```

#### Generic MCP Client Configuration

For any MCP client that supports STDIO transport:

```json
{
  "name": "mcp-project-initializer",
  "command": "node",
  "args": ["/path/to/mcp-initializer/build/index.js"],
  "transport": "stdio"
}
```

## Usage

### Starting a New Project

1. **Start the conversation**: Use the `start_mcp_project` tool
2. **Set project name**: Use `set_project_name` with your desired project name
3. **Choose directory**: Use `set_project_directory` with an absolute path
4. **Select technology**: Use `set_project_technology` (typescript or python)
5. **Provide concept**: Use `set_project_description` with a high-level overview
6. **Add documentation** (optional): Use `add_project_documentation` for additional context
7. **Setup foundation**: Use `setup_project_foundation` to create the project structure
8. **Generate context**: Use `generate_mcp_server` to prepare for AI implementation

### Example Conversation Flow

```
User: Use start_mcp_project
AI: 🚀 Welcome! I'll help you create a new MCP Server project...

User: Use set_project_name with "task-manager-mcp"
AI: ✅ Great! Project name set to: task-manager-mcp...

User: Use set_project_directory with "/Users/yourname/Projects"
AI: ✅ Perfect! Project directory set...

User: Use set_project_technology with "typescript"
AI: ✅ Excellent! Technology set to: typescript...

User: Use set_project_description with "Help users manage daily tasks with reminders"
AI: ✅ Perfect! Description captured...

User: Use setup_project_foundation
AI: 🚀 Setting up project foundation... ✓ Downloaded essential MCP documentation...

User: Use generate_mcp_server
AI: 🎉 Your Project is Ready for AI Implementation!
```

## Project Structure Created

When you run the MCP Project Initializer, it creates:

```
your-project/
├── README.md                    # Project overview
├── CLAUDE.md                    # AI development guidance
├── IMPLEMENTATION.md            # Detailed implementation guide
├── PRD.md                       # Product Requirements Document
├── package.json                 # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── .gitignore                  # Git ignore rules
├── .windsurf/
│   └── rules/                  # Development best practices
│       ├── general.md          # General coding standards
│       ├── typescript.md       # TypeScript-specific rules
│       └── mcp.md             # MCP development patterns
├── docs/
│   └── external/               # Downloaded documentation
│       ├── llms-full.txt       # MCP client compatibility
│       └── typescript-sdk-README.md  # SDK documentation
├── src/                        # Source code directory
└── tests/                      # Test directory
```

## Key Features

### AI-Enhanced Development

- **Context-Rich Setup**: Downloads essential MCP documentation automatically
- **Best Practices Integration**: Includes technology-specific coding standards
- **PRD Enhancement**: AI agents expand basic concepts into detailed specifications
- **Step-by-Step Guidance**: Clear implementation instructions for AI agents

### Technology Support

- **TypeScript**: Full Node.js MCP server setup with ES modules
- **Python**: Complete Python MCP server configuration
- **Extensible**: Easy to add support for additional technologies

### MCP Protocol Compliance

- **Tools-Only Design**: No prompts - fully compatible with tools-only clients
- **Conversational State**: Maintains conversation flow across tool calls
- **Error Handling**: Comprehensive validation and user guidance
- **Standard Transport**: Uses STDIO for maximum compatibility

## Development

### Building from Source

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode
npm run dev

# Type checking
npm run typecheck

# Linting
npm run lint
```

### Project Structure

```
mcp-initializer/
├── src/
│   ├── index.ts                # MCP server main entry
│   ├── project-initializer.ts  # Core initialization logic
│   └── types.ts               # TypeScript type definitions
├── templates/
│   └── rules/                 # Development rule templates
│       ├── typescript.md      # TypeScript best practices
│       └── python.md         # Python best practices
├── build/                     # Compiled output
└── docs/                      # Project documentation
```

## Requirements

- **Node.js**: >= 18.0.0
- **MCP Client**: Any MCP-compatible client (Windsurf, Claude Desktop, etc.)
- **Operating System**: macOS, Linux, Windows

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes following the coding standards
4. Test with a real MCP client
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
- Check the documentation in `/docs`
- Review the generated `IMPLEMENTATION.md` for guidance
- Open an issue on the project repository

---

**Ready to create AI-powered projects?** Configure this MCP server in your client and start building! 🚀