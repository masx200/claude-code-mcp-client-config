# Claude Code MCP 客户端配置完整指南

> 🎯 **一站式 MCP 服务器管理**: 从搜索、安装到测试的完整工作流程

这个项目提供了完整的 MCP (Model Context Protocol) 服务器管理工具链，让您可以轻松地发现、安装和验证各种 MCP 服务器。

## 📋 目录

- [🚀 快速开始](#-快速开始)
- [🔍 MCP 服务器搜索](#-mcp-服务器搜索)
- [📦 MCP 服务器安装](#-mcp-服务器安装)
- [🧪 MCP 服务器测试](#-mcp-服务器测试)
- [📊 支持的 MCP 服务器](#-支持的-mcp-服务器)
- [🛠️ 工具详解](#️-工具详解)
- [⚙️ 配置说明](#️-配置说明)
- [🐛 故障排除](#-故障排除)

## 🚀 快速开始

### 一键安装所有推荐服务器

```bash
# 克隆项目
git clone https://gitee.com/masx200/claude-code-mcp-client-config.git
cd claude-code-mcp-client-config

# 一键安装所有 MCP 服务器
node merge-mcp-config.js firecrawl-mcp-server.json github-mcp-server.json gitee-mcp-server.json mysql-mcp-server.json mcp_server_mysql.json tavily-mcp-server.json webdav-mcp-server.json claude_mcp_config.json

# 测试所有已安装的服务器
node mcp-tools-list-simple.js
```

## 🔍 MCP 服务器搜索

### 网络搜索工具 (Tavily)

使用 **Tavily MCP 服务器** 进行实时网络搜索和信息提取：

```bash
# 安装 Tavily 服务器
node merge-mcp-config.js tavily-mcp-server.json

# 测试搜索功能
node mcp-tools-list-simple.js
```

**功能示例**:
- 🔍 实时网络搜索
- 📄 网页内容提取
- 📰 新闻检索
- 🔬 深度研究模式

### 网页抓取工具 (Firecrawl)

使用 **Firecrawl MCP 服务器** 进行网页数据抓取：

```bash
# 安装 Firecrawl 服务器
node merge-mcp-config.js firecrawl-mcp-server.json

# 测试抓取功能
node mcp-tools-list-simple.js
```

**功能示例**:
- 🕷️ 网页内容抓取
- 🗂️ 网站地图发现
- 📋 结构化数据提取
- 🖼️ 图片和链接提取

## 📦 MCP 服务器安装

### 自动化安装工具

使用 `merge-mcp-config.js` 工具进行批量安装：

```bash
# 安装单个服务器
node merge-mcp-config.js firecrawl-mcp-server.json

# 批量安装多个服务器
node merge-mcp-config.js firecrawl-mcp-server.json github-mcp-server.json tavily-mcp-server.json

# 安装所有可用服务器
node merge-mcp-config.js firecrawl-mcp-server.json github-mcp-server.json gitee-mcp-server.json mysql-mcp-server.json mcp_server_mysql.json tavily-mcp-server.json webdav-mcp-server.json claude_mcp_config.json
```

### 安装选项

```bash
# 预览模式 (不实际安装)
node merge-mcp-config.js config.json --dry-run

# 跳过安装步骤，仅合并配置
node merge-mcp-config.js config.json --skip-install

# 详细输出模式
node merge-mcp-config.js config.json --verbose
```

## 🧪 MCP 服务器测试

### 混合模式测试工具

使用 `mcp-tools-list-simple.js` 测试所有已安装的服务器：

```bash
# 测试所有服务器 (使用默认配置文件)
node mcp-tools-list-simple.js

# 指定配置文件
node mcp-tools-list-simple.js "C:\Users\Administrator\.claude.json"

# 生成详细报告
node mcp-tools-list-simple.js > test-results.txt
```

### SDK 版本测试工具

使用 `mcp-tools-list-sdk.js` 进行纯 SDK 测试：

```bash
# 使用 MCP SDK 测试所有服务器
node mcp-tools-list-sdk.js
```

| 服务器名称 | 类型 | 工具数量 | 功能描述 | 配置文件 |
|-----------|------|----------|----------|----------|
| **GitHub** | stdio | 40 | GitHub 仓库管理、PR、Issue 操作 | `github-mcp-server.json` |
| **Gitee** | http | 26 | Gitee 代码托管平台操作 | `gitee-mcp-server.json` |
| **Firecrawl** | stdio | 8 | 网页抓取和数据提取 | `firecrawl-mcp-server.json` |
| **Tavily** | http | 4 | 网络搜索和内容提取 | `tavily-mcp-server.json` |
| **MySQL (Python)** | stdio | 1 | MySQL 数据库操作 | `mysql-mcp-server.json` |
| **MySQL (Node.js)** | stdio | 7 | MySQL 数据库操作 | `mcp_server_mysql.json` |
| **Image Search** | stdio | 1 | Unsplash 图片搜索下载 | `claude_mcp_config.json` |
| **WebDAV** | stdio | - | WebDAV 文件存储服务 | `webdav-mcp-server.json` |

**总计**: 87 个工具来自 7 个不同的 MCP 服务器

## 🛠️ 工具详解

### 1. merge-mcp-config.js - MCP 服务器安装工具

**功能**: 自动合并和安装 MCP 服务器配置

**特性**:
- ✅ 自动安装依赖包
- ✅ 配置文件自动备份
- ✅ 批量操作支持
- ✅ 预览模式
- ✅ 跨平台支持

**使用方法**:
```bash
node merge-mcp-config.js <config-files...> [options]
```

### 2. mcp-tools-list-simple.js - 混合模式测试工具

**功能**: 测试所有已配置的 MCP 服务器

**特性**:
- 🔄 **混合模式**: HTTP 服务器使用 SDK，STDIO 服务器使用 Inspector
- 📊 生成详细 Markdown 报告
- 🔍 显示每个服务器的工具列表
- ⚡ 快速故障诊断
- 🎨 彩色输出界面

**技术架构**:
```
HTTP 服务器 (gitee, tavily)
   ↓
MCP SDK (StreamableHTTPClientTransport)

STDIO 服务器 (GitHub, MySQL等)
   ↓
MCP Inspector CLI
```

### 3. mcp-tools-list-sdk.js - 纯 SDK 测试工具

**功能**: 使用官方 MCP SDK 测试所有服务器

**特性**:
- 🏗️ 完全基于 @modelcontextprotocol/sdk
- 🔗 原生 HTTP 和 STDIO 支持
- 📈 性能基准测试
- 🛠️ 开发和调试工具

## ⚙️ 配置说明

### 环境变量配置

在配置文件中使用环境变量占位符：

```json
{
  "mcpServers": {
    "tavily": {
      "type": "http",
      "url": "https://mcp.tavily.com/mcp/?tavilyApiKey=${TAVILY_API_KEY}",
      "headers": {
        "Authorization": "Bearer ${TAVILY_API_KEY}"
      }
    }
  }
}
```

### API 密钥设置

**Windows**:
```cmd
set TAVILY_API_KEY=your_api_key_here
set FIRECRAWL_API_KEY=your_api_key_here
```

**Linux/macOS**:
```bash
export TAVILY_API_KEY=your_api_key_here
export FIRECRAWL_API_KEY=your_api_key_here
```

### Claude 配置文件位置

- **Windows**: `C:\Users\%USERNAME%\.claude.json`
- **Linux/macOS**: `~/.claude.json`

## 🐛 故障排除

### 常见问题

#### 1. HTTP 服务器连接失败

**问题**: HTTP 类型服务器无法连接

**解决方案**:
```bash
# 使用 SDK 版本测试
node mcp-tools-list-sdk.js

# 检查 API 密钥
echo $TAVILY_API_KEY

# 验证网络连接
curl -I https://api.gitee.com/mcp
```

#### 2. STDIO 服务器启动失败

**问题**: stdio 类型服务器无响应

**解决方案**:
```bash
# 检查服务器是否已安装
npx -y @modelcontextprotocol/inspector --cli --config ~/.claude.json --server server-name --method tools/list

# 重新安装服务器
node merge-mcp-config.js server-config.json
```

#### 3. 配置文件格式错误

**问题**: JSON 格式或配置错误

**解决方案**:
```bash
# 验证 JSON 格式
cat ~/.claude.json | jq .

# 使用预览模式检查配置
node merge-mcp-config.js config.json --dry-run
```

### 调试技巧

1. **使用详细输出**:
   ```bash
   node merge-mcp-config.js config.json --verbose
   ```

2. **检查单个服务器**:
   ```bash
   node mcp-tools-list-simple.js | grep -A 10 "server-name"
   ```

3. **查看错误日志**:
   ```bash
   node mcp-tools-list-simple.js 2>error.log
   cat error.log
   ```

## 📈 性能优化

### 建议配置

1. **优先使用 HTTP 服务器** (响应更快)
2. **批量安装** (减少重复操作)
3. **定期更新** (保持最新版本)

### 性能对比

| 服务器类型 | 连接方式 | 响应时间 | 稳定性 |
|-----------|----------|----------|--------|
| HTTP | SDK | ~1-2秒 | ⭐⭐⭐⭐⭐ |
| STDIO | Inspector | ~3-5秒 | ⭐⭐⭐⭐ |

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 开发环境设置

```bash
# 安装依赖
npm install

# 运行测试
npm test

# 代码格式化
npm run format
```

## 📄 许可证

[ISC License](LICENSE)

## 🔗 相关链接

- [Claude Code 官方文档](https://docs.claude.com/claude-code)
- [MCP 协议规范](https://modelcontextprotocol.io/)
- [项目仓库](https://gitee.com/masx200/claude-code-mcp-client-config)

---

> 💡 **提示**: 建议定期更新 MCP 服务器以获得最新功能和安全修复。

> 🚀 **开始使用**: 运行 `node mcp-tools-list-simple.js` 查看您当前已安装的 MCP 服务器和工具！
