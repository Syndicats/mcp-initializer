**Python Implementation**:
- Create `src/main.py` as the main server entry point
- Follow the coding standards in `.windsurf/rules/python.md`
- Use type hints and proper error handling
- Create comprehensive tests in `tests/` directory

**Key Python Patterns**:
```python
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool

server = Server("{{projectName}}")

@server.list_tools()
async def list_tools() -> list[Tool]:
    return [/* your tools */]

@server.call_tool()
async def call_tool(name: str, arguments: dict) -> dict:
    # Handle tool calls
    pass
```