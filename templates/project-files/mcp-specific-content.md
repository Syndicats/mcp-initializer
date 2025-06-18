## MCP Server Development

### Best Practices from modelcontextprotocol.io
- **Start small and iterate** - build core functionality first, then expand
- **Break down complex servers** into smaller, manageable pieces
- **Test each component thoroughly** before adding more features
- **Keep security in mind** - validate inputs and limit access appropriately
- **Use the MCP Inspector tool** for testing during development
- **Follow MCP protocol specifications** carefully
- **Document code for future maintenance**
- **Implement proper error handling and logging**
- **Ask LLM to explain code** you don't understand
- **Request modifications and improvements** from LLM assistance
- **Have LLM help test** the server and handle edge cases

### Key MCP Features to Implement
- **Resource management** - expose data and content
- **Tool definitions** - provide executable functions
- **Prompt templates** - offer reusable prompt patterns
- **Error handling** - graceful failure management
- **Logging** - comprehensive activity tracking
- **Connection and transport setup** - STDIO communication

### Development Workflow
1. **Gather comprehensive documentation** before beginning
2. **Define server requirements** clearly:
   - Resources to expose
   - Tools to provide
   - Prompts to offer
   - External systems to interact with
3. **Implement core functionality** incrementally
4. **Test with MCP Inspector** throughout development
5. **Connect to clients** like Claude.app for real-world testing
6. **Iterate based on usage and feedback**

### Architecture Requirements
- **Language**: TypeScript with Node.js (LTS version)
- **Protocol**: Model Context Protocol (MCP) over STDIO
- **Core Dependency**: @modelcontextprotocol/sdk TypeScript SDK
- **LLM Interaction**: Uses "Prompt Server / Response" pattern
- **No direct LLM API keys** - server must NOT have its own LLM API key
- **Final script** should be executable directly from command line

### Testing and Validation
- Use MCP Inspector tool for development testing
- Connect to real MCP clients for integration testing
- Test error scenarios and edge cases thoroughly
- Validate all resource access and tool execution
- Ensure proper input validation and security measures