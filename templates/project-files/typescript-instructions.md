**TypeScript Implementation**:
- Create `src/index.ts` as the main server entry point
- Use ES modules and modern TypeScript features
- Follow the coding standards in `.windsurf/rules/typescript.md`
- Implement proper type safety and error handling
- Create comprehensive tests in `tests/` directory
- If a "tool" has no input parameters, leave out the empty "inputSchema" property for the tool registration

**Key TypeScript Patterns**:
```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

// Server configuration
const server = new Server({
  name: "{{projectName}}",
  version: "1.0.0",
  capabilities: { tools: true }
}, { capabilities: { tools: {} } });

// Tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [/* your tools */]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  // Handle tool calls
});
```