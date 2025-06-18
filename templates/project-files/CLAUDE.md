# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

{{description}}

## Technology Stack

**Primary Technology**: {{technology}}
{{mcpSpecificContent}}
## Getting Started

**IMPORTANT**: Before starting any development work, read **IMPLEMENTATION.md** for complete context and implementation guidance.

## Development Guidelines

### Code Quality
- Follow existing code conventions and patterns
- Use {{technology}} for type safety
- Write comprehensive tests
- Document complex logic
- **Always reference the technology-specific rules** in .windsurf/rules/

### Security
- Never commit secrets or API keys
- Validate all inputs
- Follow security best practices

### AI Development Best Practices
- **Read all context files first** (listed above)
- Start with core functionality and iterate
- Break complex features into smaller components
- Test thoroughly before expanding
- Keep documentation up to date
- **Follow the specific patterns** defined in PRD.md

## Important Instructions

Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.

## Context Validation

Before starting work, confirm you have read:
- [ ] PRD.md
- [ ] .windsurf/rules/general.md
- [ ] .windsurf/rules/{{technologySlug}}.md
- [ ] docs/external/ folder contents (if exists)
- [ ] Any project-specific documentation

If you haven't read these files, STOP and read them first using the Read tool.