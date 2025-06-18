# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an MCP (Model Context Protocol) Project Initializer - a command-line MCP server that automates the setup of new AI-powered software projects. The tool acts as a conversational guide through any standard MCP client to set up projects with necessary context, rules, and documentation for AI-assisted development.

## Architecture

### Core Requirements
- **Language**: TypeScript
- **Runtime**: Node.js (LTS version)
- **Protocol**: Model Context Protocol (MCP) communicating over STDIO
- **Core Dependency**: `@modelcontextprotocol/sdk` TypeScript SDK
- **LLM Interaction**: Uses "Prompt Server / Response" pattern (`mcp_prompt_request` and `mcp_llm_response`) - no direct LLM API keys

### Key Features to Implement
1. **Conversational Project Initialization** - Trigger setup workflow via `/init-mcp` command
2. **Technology-Specific Context Fetching** - Download best-practice rules and SDK docs
3. **Custom Documentation Ingestion** - Handle URLs and raw text input
4. **LLM-Powered PRD Generation** - Generate project documentation using gathered context
5. **Local File System Operations** - Create directories and save files to project structure

## Development Status

This is a greenfield project - currently contains only planning documentation:
- `docs/prd.md`: Complete Product Requirements Document
- `docs/llms-full.txt`: MCP client compatibility matrix and examples

## Key Design Principles

- Server must NOT have its own LLM API key
- Final script should be executable directly from command line
- Focus on TypeScript/Node.js ecosystem initially
- Leverage existing MCP protocol patterns for client communication