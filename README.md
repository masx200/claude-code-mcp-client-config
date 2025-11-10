# Claude Code MCP 配置示例

这个项目演示如何为 Claude Code 配置 MCP (Model Context Protocol) 服务器。

## 配置文件位置

Claude Code 的 MCP 配置通常位于 `$HOME/.claude.json` 文件中。

## MCP 服务器配置

以下是一个完整的 MCP 服务器配置示例：

```json
{
  "mcpServers": {
    "webdav": {
      "type": "stdio",
      "command": "pnpx",
      "args": ["webdav-mcp-server"],
      "env": {
        "WEBDAV_PASSWORD": "${password}",
        "WEBDAV_USERNAME": "${username}",
        "WEBDAV_AUTH_ENABLED": "true",
        "WEBDAV_ROOT_URL": "${rooturl}"
      }
    },
    "tavily": {
      "type": "http",
      "url": "https://mcp.tavily.com/mcp/?tavilyApiKey=${apikey}"
    }
  }
}
```

## 配置说明

### WebDAV MCP 服务器

- **类型**: stdio (标准输入输出)
- **命令**: 使用 `pnpx` 启动 webdav-mcp-server
- **环境变量**:
  - `WEBDAV_USERNAME`: WebDAV 用户名
  - `WEBDAV_PASSWORD`: WebDAV 密码
  - `WEBDAV_AUTH_ENABLED`: 是否启用认证
  - `WEBDAV_ROOT_URL`: WebDAV 服务器根地址

### Tavily MCP 服务器

- **类型**: http (HTTP 请求)
- **URL**: Tavily MCP 服务的端点地址
- **API Key**: 直接在 URL 中包含 API 密钥

## MCP 配置合并工具

项目提供了 `merge-mcp-config.js` 工具，用于将新的 MCP 服务器配置合并到现有的
Claude 配置中，并支持自动安装 MCP 服务器。该工具使用 yargs
提供强大的命令行参数解析。

### 使用方法

```bash
# 从单个文件合并配置（包含自动安装）
node merge-mcp-config.js config.json

# 合并多个配置文件
node merge-mcp-config.js firecrawl-mcp-server.json github-mcp-server.json webdav-mcp-server.json

# 跳过安装步骤，仅合并配置
node merge-mcp-config.js config.json --skip-install

# 预览模式，查看将要合并的配置而不实际修改
node merge-mcp-config.js config.json --dry-run

# 显示详细输出
node merge-mcp-config.js config.json --verbose

# 从 JSON 字符串合并配置
node merge-mcp-config.js '{"mcpServers": {"server1": {...}}}'
```

### 功能特性

- **多文件支持**: 支持同时合并多个配置文件
- **自动安装**: 支持在合并配置前自动安装 MCP 服务器
- **预览模式**: 使用 `--dry-run` 预览将要合并的配置
- **安全备份**: 工具会自动创建现有配置的备份文件（`.backup.[timestamp]`）
- **智能合并**: 只合并 `mcpServers` 部分，保留其他配置不变
- **错误处理**: 完整的输入验证和错误提示
- **灵活输入**: 支持从文件或直接从 JSON 字符串读取配置
- **跨平台支持**: 自动检测操作系统并使用适当的 shell 执行安装命令
- **详细输出**: 使用 `--verbose` 查看详细的执行过程

### 命令行选项

- `inputs`: 配置文件路径或JSON字符串（支持多个）
- `--skip-install, --no-install`: 跳过 MCP 服务器的自动安装步骤
- `--verbose, -v`: 显示详细输出
- `--dry-run`: 预览模式，不实际修改配置文件
- `--help, -h`: 显示帮助信息
- `--version, -V`: 显示版本号

### 支持的安装命令

项目为以下 MCP 服务器提供了预配置的安装命令：

- **firecrawl-mcp-server**: `npm install -g firecrawl-mcp@latest`
- **github-mcp-server**:
  `go install github.com/github/github-mcp-server/cmd/github-mcp-server@latest`
- **webdav-mcp-server**: `pnpm install -g webdav-mcp-server`

### 示例用法

1. **从单个配置文件合并**：

   ```bash
   node merge-mcp-config.js firecrawl-mcp-server.json
   ```

2. **合并多个配置文件**：

   ```bash
   node merge-mcp-config.js firecrawl-mcp-server.json github-mcp-server.json webdav-mcp-server.json
   ```

3. **预览模式查看将要合并的配置**：

   ```bash
   node merge-mcp-config.js firecrawl-mcp-server.json github-mcp-server.json --dry-run
   ```

4. **跳过安装，仅合并配置**：

   ```bash
   node merge-mcp-config.js config.json --skip-install
   ```

5. **直接输入 JSON 配置**：

   ```bash
   node merge-mcp-config.js '{"mcpServers": {"myserver": {"type": "http", "url": "https://example.com/mcp"}}}'
   ```

6. **查看详细执行过程**：
   ```bash
   node merge-mcp-config.js config.json --verbose
   ```

### 工具流程

1. **解析命令行参数**（使用 yargs 进行参数解析）
2. **读取并验证输入配置**（支持多个文件或 JSON 字符串）
3. **合并所有输入配置**（如果提供多个文件）
4. **自动安装 MCP 服务器**（如果配置了 `installCommand` 且未跳过安装）
5. **预览模式检查**（如果启用 `--dry-run`，显示将要合并的配置并退出）
6. 读取现有的 `~/.claude.json` 配置
7. 创建备份文件
8. 合并新的服务器配置到现有配置
9. 写入更新后的配置文件

### 输出示例

**多文件合并输出：**

```
从文件读取配置: firecrawl-mcp-server.json
从文件读取配置: github-mcp-server.json
开始安装MCP服务器...
准备安装 firecrawl-mcp-server...
执行安装命令: npm install -g firecrawl-mcp@latest
准备安装 GitHub...
执行安装命令: go install github.com/github/github-mcp-server/cmd/github-mcp-server@latest
所有安装命令执行完成
读取现有的Claude配置: /home/user/.claude.json
创建备份: /home/user/.claude.json.backup.1701234567890
配置已成功写入到 /home/user/.claude.json

合并完成!
现有的MCP服务器:
  - webdav
  - tavily
  - firecrawl
  - GitHub
```

**预览模式输出：**

```
从文件读取配置: firecrawl-mcp-server.json
跳过安装步骤

=== 预览模式 ===
将要合并的MCP服务器:
  - firecrawl-mcp-server
配置文件未被修改。
```

**详细模式输出：**

```
输入参数: firecrawl-mcp-server.json, github-mcp-server.json
跳过安装: false
预览模式: false
从文件读取配置: firecrawl-mcp-server.json
从文件读取配置: github-mcp-server.json
...
```

## 安装步骤

### 方式一：使用配置合并工具（推荐）

1. **安装依赖**：

   ```bash
   npm install
   ```

2. **预览配置**（可选）：

   ```bash
   node merge-mcp-config.js firecrawl-mcp-server.json --dry-run
   ```

3. **自动安装并配置**：

   ```bash
   # 单个服务器
   node merge-mcp-config.js firecrawl-mcp-server.json

   # 或同时安装多个服务器
   node merge-mcp-config.js firecrawl-mcp-server.json github-mcp-server.json webdav-mcp-server.json
   ```

4. **重启 Claude Code** 使配置生效

### 方式二：手动配置

1. 确保已安装 Claude Code
2. 手动安装所需的 MCP 服务器：

   ```bash
   # Firecrawl MCP 服务器
   npm install -g firecrawl-mcp@latest

   # GitHub MCP 服务器
   go install github.com/github/github-mcp-server/cmd/github-mcp-server@latest

   # WebDAV MCP 服务器
   pnpm install -g webdav-mcp-server
   ```

3. 创建或编辑配置文件 `$HOME/.claude.json`
4. 复制相应的配置到文件中
5. 根据需要修改配置参数（如 API 密钥）
6. 重启 Claude Code 使配置生效

## 注意事项

- 确保所有必需的环境变量都已正确设置
- 对于生产环境，请使用安全的 API 密钥管理方式
- WebDAV 服务器需要在指定的端口 (1900) 上运行

## 相关链接

- [Claude Code 官方文档](https://docs.claude.com/)
- [MCP 协议规范](https://modelcontextprotocol.io/)
- [WebDAV MCP Server](https://github.com/your-webdav-mcp-repo)
- [Tavily MCP Service](https://tavily.com/)
