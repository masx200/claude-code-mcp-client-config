# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个 Claude Code MCP (Model Context Protocol) 客户端配置示例项目，用于演示如何为 Claude Code 配置各种 MCP 服务器。

## 核心功能

### MCP 服务器配置管理

项目提供了完整的 MCP 服务器配置示例和管理工具：

1. **WebDAV MCP 服务器** - 使用 stdio 类型的服务器配置
2. **Tavily MCP 服务器** - 使用 HTTP 类型的服务器配置
3. **Firecrawl MCP 服务器** - 包含 API 密钥配置的示例

### 配置合并工具

`merge-mcp-config.js` 是一个命令行工具，用于合并新的 MCP 服务器配置到现有的 Claude 配置中：

```bash
# 从文件合并配置
node merge-mcp-config.js config.json

# 从 JSON 字符串合并配置
node merge-mcp-config.js '{"mcpServers": {"server1": {...}}}'
```

## 开发工作流程

### 添加新的 MCP 服务器配置

1. 在 `example-*.json` 文件中创建新的配置示例
2. 使用 `merge-mcp-config.js` 工具将配置合并到 `~/.claude.json`
3. 工具会自动创建配置文件的备份

### 配置文件结构

MCP 服务器配置支持两种类型：

- **stdio**: 通过标准输入输出通信的服务器
- **http**: 通过 HTTP 端点访问的服务器

每个服务器配置包含：

- `type`: 服务器通信类型
- `command`/`url`: 启动命令或访问 URL
- `args`/`env`: 命令行参数或环境变量
- `description`: 服务器描述

## 环境变量管理

项目中的配置示例使用环境变量占位符（如 `${apikey}`），实际使用时需要：

1. 替换为实际的 API 密钥
2. 或通过系统环境变量传递
3. 确保敏感信息不会提交到版本控制

## 注意事项

- Claude 配置文件位置：`$HOME/.claude.json`
- 配置合并工具会自动创建 `.backup.*` 文件
- 确保所有必需的环境变量都已正确设置
- 对于生产环境，请使用安全的 API 密钥管理方式
