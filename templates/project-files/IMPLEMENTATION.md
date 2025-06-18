# Implementation Guide

## STEP 1: Required Context Files

**CRITICAL**: Before starting any development work, you MUST read and incorporate the following documentation files into your context:

### Essential MCP Documentation (READ FIRST)
1. **docs/external/llms-full.txt** - MCP client compatibility matrix and usage patterns (REQUIRED)
2. **docs/external/{{technologySlug}}-sdk-README.md** - Complete SDK documentation for {{technology}} (REQUIRED)

### Project Documentation  
3. **PRD.md** - Product Requirements Document with complete project specifications
4. **README.md** - Project overview and getting started guide

### Development Rules (CRITICAL FOR CODE QUALITY)
5. **.windsurf/rules/{{technologySlug}}.md** - Technology-specific best practices and coding standards
6. **.windsurf/rules/general.md** - General development rules and patterns
7. **.windsurf/rules/*.md** - All other development rules and coding standards

### Additional Documentation (if present)
8. **docs/external/*.md** - Additional API documentation and specifications

**⚠️ ACTION REQUIRED**: Use the Read tool to examine ALL files listed above before beginning any implementation work. These files contain critical context, requirements, and standards that must be followed.

## Project Overview

**Project Name**: {{projectName}}
**Technology**: {{technology}}
**Core Concept**: {{description}}

## STEP 2: Enhance the PRD

**IMPORTANT**: The PRD.md file contains a basic concept that needs AI enhancement. Before implementation:

1. **Read PRD.md** to understand the core concept
2. **Expand the requirements** using your AI knowledge:
   - Define detailed functional requirements
   - Create specific user stories and use cases
   - Plan MCP tools and resources needed
   - Design data models and API contracts
   - Consider error scenarios and edge cases
3. **Document your enhanced requirements** by updating PRD.md with your expanded specification

## STEP 3: Implementation Requirements

### MCP Server Architecture

You need to implement an MCP (Model Context Protocol) server that:

1. **Follows MCP Protocol Standards**:
   - Uses the @modelcontextprotocol/sdk (TypeScript) or mcp package (Python)
   - Implements STDIO transport for communication
   - Follows MCP protocol specifications exactly
   - Does NOT require its own LLM API key

2. **Core Functionality**:
   {{description}}

3. **Required Components**:
   - Server configuration and initialization
   - Tool definitions and handlers
   - Request/response handling
   - Error handling and validation
   - Proper logging and debugging support

### Implementation Guidelines

#### Technology-Specific Instructions

{{technologySpecificInstructions}}

### Functional Requirements

Based on your description: "{{description}}"

**Implement the following**:

1. **Tool Definitions**: Create tools that accomplish the described functionality
2. **Request Handling**: Process user requests and return appropriate responses
3. **Error Management**: Handle edge cases and provide helpful error messages
4. **Input Validation**: Validate all inputs according to your tool schemas
5. **Response Formatting**: Return properly formatted MCP responses

### Quality Requirements

- **Follow all coding standards** from `.windsurf/rules/`
- **Implement comprehensive error handling**
- **Add proper logging for debugging**
- **Write meaningful tests** that cover your functionality
- **Document your code** with clear comments
- **Validate all inputs** from users
- **Handle edge cases gracefully**

### Testing Strategy

1. **Unit Tests**: Test individual functions and components
2. **Integration Tests**: Test the MCP server as a whole
3. **Error Scenarios**: Test error handling and edge cases
4. **Real Client Testing**: Test with actual MCP clients when possible

### Development Workflow

1. **Read all context files** listed in CLAUDE.md
2. **Start with basic server structure** and tool definitions
3. **Implement core functionality** incrementally
4. **Add comprehensive error handling**
5. **Write and run tests** throughout development
6. **Test with MCP Inspector** or real clients
7. **Refine and optimize** based on testing results

### Success Criteria

Your implementation should:
- ✅ Successfully communicate via MCP protocol
- ✅ Provide the described functionality
- ✅ Follow all coding standards and best practices
- ✅ Handle errors gracefully
- ✅ Be well-tested and documented
- ✅ Work with real MCP clients

---

**Remember**: This is your chance to implement a creative, high-quality solution using your full AI knowledge and capabilities. Use the context files as guidance, but feel free to implement innovative approaches that best serve the user's needs!