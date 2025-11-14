# MCP图片工具安装指南

## 搜索到的MCP图片工具

根据搜索结果，我发现了以下主要的MCP图片搜索和下载工具：

### 1. mcp-unsplash-image-downloader

- **描述**: 基于Unsplash API的智能图片搜索下载工具
- **安装命令**: `npx -y mcp-unsplash-image-downloader` 或
  `npm install -g mcp-unsplash-image-downloader`
- **API需求**: Unsplash Access Key
- **特点**:
  - 支持中英文搜索
  - 自动版权标识
  - 智能目录管理
  - 支持Claude Desktop集成

## 配置文件

已生成配置文件: `claude_mcp_config.json`

```json
{
  "mcpServers": {
    "image-search-unsplash": {
      "command": "npx",
      "args": ["-y", "mcp-unsplash-image-downloader"],
      "env": {
        "UNSPLASH_ACCESS_KEY": "your_unsplash_api_key_here"
      }
    }
  }
}
```

## 手动安装步骤

### 步骤1: 获取API密钥

1. **Unsplash API**
   - 访问: https://unsplash.com/developers
   - 注册开发者账户
   - 创建新应用
   - 获取Access Key (不是Secret Key)

2. **Pexels API** (可选)
   - 访问: https://www.pexels.com/api/
   - 注册并获取API密钥

3. **Pixabay API** (可选)
   - 访问: https://pixabay.com/api/docs/
   - 注册并获取API密钥

4. **Together AI API** (用于图标生成)
   - 访问: https://api.together.xyz/keys
   - 注册并获取API密钥

### 步骤2: 安装工具

#### 安装方式A: 快速安装 (推荐)

```bash
# 安装mcp-unsplash-image-downloader
npm install -g mcp-unsplash-image-downloader
```

#### 安装方式B: 完整安装 (多API支持)

```bash
# 2. 安装Python依赖
pip3 install fastmcp requests


# 4. 编辑配置文件，填入API密钥
```

### 步骤3: 更新配置文件

编辑 `claude_mcp_config.json`，将所有的 `"your_xxx_api_key_here"`
替换为实际的API密钥。

### 步骤4: 合并到Claude配置

```bash
# 使用修复版工具
node merge-mcp-config-cjs.js claude_mcp_config.json

# 或者手动复制到Claude配置
# 将mcpServers部分添加到 ~/.claude.json
```

## 使用示例

安装完成后，您可以这样使用：

### 图片搜索

```
"帮我搜索一些关于'technology'的图片"
"在Unsplash上找5张人工智能相关的图片"
```

### 图片下载

```
"下载第2张图片，保存为tech-icon.png"
"把搜索结果中的图片保存到public/images文件夹"
```

### 图标生成 (需要Together AI密钥)

```
"生成一个蓝色科技风格的图标，保存为blue-tech.png"
```

## 故障排除

### 常见问题

1. **工具无法启动**
   - 检查Node.js版本: `node --version` (需要 >=16.0.0)
   - 检查Python版本: `python3 --version` (需要 >=3.10)

2. **API连接失败**
   - 验证API密钥是否正确
   - 检查网络连接
   - 确认API配额未超限

3. **Claude无法连接MCP服务器**
   - 重启Claude应用
   - 检查配置文件路径
   - 验证MCP服务器是否运行

## 文件清单

已创建以下文件：

- `/workspace/claude_mcp_config.json` - MCP服务器配置
- `/workspace/merge-mcp-config-cjs.js` - 修复版安装工具
- `/workspace/install_mcp_tools_simple.sh` - 安装脚本

按照指南完成安装后，您就可以在Claude中使用这些强大的图片搜索和下载功能了！
