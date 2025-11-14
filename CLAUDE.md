# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## 项目概述

这是一个 Claude Code MCP (Model Context Protocol)
客户端配置示例项目，用于演示如何为 Claude Code 配置各种 MCP 服务器。

## 核心功能

### MCP 服务器配置管理

项目提供了完整的 MCP 服务器配置示例和管理工具：

#### stdio 类型服务器

1. **Firecrawl MCP 服务器** - 网页抓取和数据提取服务
2. **GitHub MCP 服务器** - GitHub 仓库管理和操作
3. **Image Search Unsplash MCP 服务器** - Unsplash 图片搜索和下载
4. **MySQL (uv) MCP 服务器** - MySQL 数据库操作 (Python 版本)
5. **MySQL (npm) MCP 服务器** - MySQL 数据库操作 (Node.js 版本)
6. **WebDAV MCP 服务器** - WebDAV 文件存储服务

#### http 类型服务器

1. **Tavily MCP 服务器** - 网络搜索和内容提取
2. **Gitee MCP 服务器** - Gitee 代码托管平台

### 配置文件清单

项目包含以下 MCP 服务器配置文件：

- `firecrawl-mcp-server.json` - Firecrawl 网页抓取服务
- `github-mcp-server.json` - GitHub 代码托管平台
- `gitee-mcp-server.json` - Gitee 代码托管平台
- `claude_mcp_config.json` - Image Search Unsplash 图片搜索
- `mysql-mcp-server.json` - MySQL 数据库 (Python 版本)
- `mcp_server_mysql.json` - MySQL 数据库 (Node.js 版本)
- `tavily-mcp-server.json` - Tavily 网络搜索服务
- `webdav-mcp-server.json` - WebDAV 文件存储服务

### 配置合并工具

`merge-mcp-config.js` 是一个功能强大的命令行工具，用于合并新的 MCP
服务器配置到现有的 Claude 配置中，支持自动安装和批量操作：

```bash
# 从单个文件合并配置（包含自动安装）
node merge-mcp-config.js firecrawl-mcp-server.json

# 合并多个配置文件
node merge-mcp-config.js firecrawl-mcp-server.json github-mcp-server.json webdav-mcp-server.json

# 安装所有可用的 MCP 服务器
node merge-mcp-config.js firecrawl-mcp-server.json github-mcp-server.json gitee-mcp-server.json mysql-mcp-server.json tavily-mcp-server.json webdav-mcp-server.json claude_mcp_config.json

# 跳过安装步骤，仅合并配置
node merge-mcp-config.js config.json --skip-install

# 预览模式，查看将要合并的配置而不实际修改
node merge-mcp-config.js config.json --dry-run

# 从 JSON 字符串合并配置
node merge-mcp-config.js '{"mcpServers": {"server1": {...}}}'
```

### 工具特性

- **自动安装**: 支持在合并前自动安装 MCP 服务器（如果配置了 `installCommand`）
- **批量操作**: 支持同时合并多个配置文件
- **安全备份**: 自动创建现有配置的备份文件
- **预览模式**: 使用 `--dry-run` 预览将要合并的配置
- **跨平台**: 自动检测操作系统并使用适当的 shell 执行命令
- **详细输出**: 使用 `--verbose` 查看详细的执行过程

## 开发工作流程

### 添加新的 MCP 服务器配置

1. 在相应的 JSON 配置文件中创建新的配置示例
2. 确保配置中包含必要的 `installCommand` 字段（如果需要自动安装）
3. 使用 `merge-mcp-config.js` 工具将配置合并到 `~/.claude.json`
4. 工具会自动创建配置文件的备份并安装所需的服务器

### 快速开始

1. **安装单个服务器**：
   ```bash
   node merge-mcp-config.js firecrawl-mcp-server.json
   ```

2. **安装多个服务器**：
   ```bash
   node merge-mcp-config.js firecrawl-mcp-server.json github-mcp-server.json webdav-mcp-server.json
   ```

3. **安装所有服务器**：
   ```bash
   node merge-mcp-config.js firecrawl-mcp-server.json github-mcp-server.json gitee-mcp-server.json mysql-mcp-server.json mcp_server_mysql.json tavily-mcp-server.json webdav-mcp-server.json claude_mcp_config.json
   ```

### 配置文件结构

MCP 服务器配置支持两种类型：

- **stdio**: 通过标准输入输出通信的服务器
- **http**: 通过 HTTP 端点访问的服务器

每个服务器配置包含：

- `type`: 服务器通信类型 (stdio/http)
- `command`/`url`: 启动命令或访问 URL
- `args`: 命令行参数 (可选)
- `env`: 环境变量配置 (可选)
- `installCommand`: 自动安装命令 (可选，推荐)
- `description`: 服务器描述 (可选)
- `name`: 服务器名称 (可选)
- `isActive`: 是否激活服务器 (可选)

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
