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

项目提供了 `merge-mcp-config.js` 工具，用于将新的 MCP 服务器配置合并到现有的 Claude 配置中。

### 使用方法

```bash
# 从文件合并配置
node merge-mcp-config.js config.json

# 从 JSON 字符串合并配置
node merge-mcp-config.js '{"mcpServers": {"server1": {...}}}'
```

### 功能特性

- **安全备份**: 工具会自动创建现有配置的备份文件（`.backup.[timestamp]`）
- **智能合并**: 只合并 `mcpServers` 部分，保留其他配置不变
- **错误处理**: 完整的输入验证和错误提示
- **灵活输入**: 支持从文件或直接从 JSON 字符串读取配置

### 示例用法

1. **从示例配置文件合并**：
   ```bash
   node merge-mcp-config.js example-firecrawl.json
   ```

2. **直接输入 JSON 配置**：
   ```bash
   node merge-mcp-config.js '{"mcpServers": {"myserver": {"type": "http", "url": "https://example.com/mcp"}}}'
   ```

### 工具流程

1. 读取输入配置（文件或 JSON 字符串）
2. 验证配置格式（必须包含 `mcpServers` 对象）
3. 读取现有的 `~/.claude.json` 配置
4. 创建备份文件
5. 合并新的服务器配置
6. 写入更新后的配置文件

### 输出示例

```
从文件读取配置: example-firecrawl.json
读取现有的Claude配置: /home/user/.claude.json
创建备份: /home/user/.claude.json.backup.1701234567890
配置已成功写入到 /home/user/.claude.json

合并完成!
现有的MCP服务器:
  - webdav
  - tavily
  - firecrawl
```

## 安装步骤

1. 确保已安装 Claude Code
2. 创建或编辑配置文件 `$HOME/.claude.json`
3. 复制上述配置到文件中
4. 根据需要修改配置参数
5. 重启 Claude Code 使配置生效

## 注意事项

- 确保所有必需的环境变量都已正确设置
- 对于生产环境，请使用安全的 API 密钥管理方式
- WebDAV 服务器需要在指定的端口 (1900) 上运行

## 相关链接

- [Claude Code 官方文档](https://docs.claude.com/)
- [MCP 协议规范](https://modelcontextprotocol.io/)
- [WebDAV MCP Server](https://github.com/your-webdav-mcp-repo)
- [Tavily MCP Service](https://tavily.com/)
