# Image Search Unsplash MCP 工具使用指南

## 概述

image-search-unsplash 是一个强大的 MCP (Model Context Protocol)
工具，可以根据关键词搜索 Unsplash
图片并直接下载到您的项目文件夹中。该工具非常适合为项目快速添加高质量的图片资源。

## 功能特性

- 🔍 **智能搜索**: 通过关键词搜索 Unplash 的高质量图片
- 📁 **直接下载**: 图片直接下载到指定的项目文件夹
- 🏷️ **自动引用**: 返回相对路径和作者信息，便于引用
- 📝 **详细元数据**: 提供图片描述、作者信息等完整数据

## 安装与配置

### 1. 添加 MCP 服务器配置

在您的 Claude 配置文件中添加以下配置：

```json
{
  "mcpServers": {
    "image-search-unsplash": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "mcp-unsplash-image-downloader"],
      "env": {
        "UNSPLASH_ACCESS_KEY": "your_unsplash_api_key_here"
      },
      "description": "Unsplash 图片搜索和下载工具"
    }
  }
}
```

### 2. 验证安装

重启 Claude Code 后，工具将自动可用。您可以通过以下命令验证：

```bash
# 检查工具是否可用
claude mcp list
```

## 基本使用方法

### Hello World 示例

以下是一个简单的 "Hello World" 测试，演示如何搜索并下载图片：

```javascript
// 调用 MCP 工具搜索并下载图片
const result = await imageSearchUnsplash({
  query: "hello world",
  saveDir: "images",
  filename: "hello-world-test",
});

console.log(result);
```

**预期输出：**

```json
{
  "success": true,
  "message": "图片已成功下载到 E:\\projects\\your-project\\images\\hello-world-test.jpg",
  "filePath": "E:\\projects\\your-project\\images\\hello-world-test.jpg",
  "relativePathForTag": "/images/hello-world-test.jpg",
  "suggestedAltText": "a laptop computer sitting on top of a wooden desk",
  "author": "Photo by Clay Banks on Unsplash",
  "authorUrl": "https://unsplash.com/@claybanks",
  "downloadUrl": "https://api.unsplash.com/photos/8q6e5hu3Ilc/download?ixid=M3w4MzA0ODJ8MHwxfHNlYXJjaHwxfHxoZWxsbyUyMHdvcmxkfGVufDB8MHx8fDE3NjMwOTQ0Njl8MA"
}
```

## 参数说明

### 必需参数

| 参数      | 类型   | 描述                     | 示例                                      |
| --------- | ------ | ------------------------ | ----------------------------------------- |
| `query`   | string | 搜索关键词               | `"modern office"`、`"team collaboration"` |
| `saveDir` | string | 保存目录（项目相对路径） | `"src/assets/images"`、`"public/images"`  |

### 可选参数

| 参数       | 类型   | 描述                       | 示例                          |
| ---------- | ------ | -------------------------- | ----------------------------- |
| `filename` | string | 自定义文件名（不含扩展名） | `"header-bg"`、`"team-photo"` |

## 使用场景

### 1. 项目头像和图标

```javascript
// 搜索应用图标
await imageSearchUnsplash({
  query: "mobile app icon design",
  saveDir: "assets/icons",
  filename: "app-icon",
});
```

### 2. 博客文章配图

```javascript
// 搜索技术相关图片
await imageSearchUnsplash({
  query: "programming code computer",
  saveDir: "public/blog-images",
  filename: "coding-background",
});
```

### 3. UI 设计素材

```javascript
// 搜索背景图片
await imageSearchUnsplash({
  query: "minimal gradient background",
  saveDir: "src/assets/backgrounds",
  filename: "hero-bg",
});
```

### 4. 产品展示

```javascript
// 搜索办公场景
await imageSearchUnsplash({
  query: "modern office workspace",
  saveDir: "assets/product",
  filename: "office-environment",
});
```

## 返回结果解析

成功调用后，工具会返回包含以下信息的对象：

```json
{
  "success": boolean,           // 操作是否成功
  "message": string,            // 状态消息
  "filePath": string,           // 完整的本地文件路径
  "relativePathForTag": string, // 用于 HTML img 标签的相对路径
  "suggestedAltText": string,   // 建议的 alt 文本
  "author": string,             // 作者信息和来源
  "authorUrl": string,          // 作者 Unsplash 主页
  "downloadUrl": string         // 图片下载链接
}
```

## 最佳实践

### 1. 目录结构建议

建议在项目中创建合理的目录结构：

```
your-project/
├── assets/
│   ├── images/
│   │   ├── backgrounds/
│   │   ├── icons/
│   │   └── content/
│   └── downloads/
```

### 2. 文件命名规范

- 使用描述性的文件名
- 避免特殊字符和空格
- 使用连字符分隔单词

```javascript
// 好的命名示例
await imageSearchUnsplash({
  query: "team meeting office",
  saveDir: "assets/images",
  filename: "team-meeting-office",
});
```

### 3. 搜索关键词技巧

- 使用英文关键词获得更好的搜索结果
- 组合多个相关关键词
- 添加风格描述词：`minimal`、`modern`、`professional`

```javascript
// 推荐的搜索关键词
await imageSearchUnsplash({
  query: "minimal professional workspace",
  saveDir: "assets/images",
  filename: "clean-office",
});
```

### 4. 版权和引用

Unsplash 图片允许免费使用，但建议：

1. 在图片旁边注明作者
2. 在项目文档中包含图片来源链接
3. 考虑在页脚添加 Unsplash 致谢信息

```html
<!-- HTML 中的引用示例 -->
<img
  src="/images/hello-world-test.jpg"
  alt="a laptop computer sitting on top of a wooden desk"
/>
<p class="photo-credit">
  <small
    >Photo by
    <a href="https://unsplash.com/@claybanks" target="_blank">Clay Banks</a> on
    <a href="https://unsplash.com" target="_blank">Unsplash</a></small
  >
</p>
```

## 故障排除

### 常见问题

1. **下载失败**: 检查网络连接和目录权限
2. **搜索无结果**: 尝试不同的关键词组合
3. **保存目录不存在**: 确保指定的目录存在或有创建权限

### 错误处理

```javascript
try {
  const result = await imageSearchUnsplash({
    query: "your search term",
    saveDir: "your/directory",
  });

  if (result.success) {
    console.log("图片下载成功:", result.relativePathForTag);
  } else {
    console.error("图片下载失败:", result.message);
  }
} catch (error) {
  console.error("工具调用失败:", error);
}
```

## 高级用法

### 批量下载

可以创建函数批量下载多张图片：

```javascript
async function downloadMultipleImages(searches) {
  for (const search of searches) {
    try {
      const result = await imageSearchUnsplash(search);
      console.log(`已下载: ${result.relativePathForTag}`);
    } catch (error) {
      console.error(`下载失败 "${search.query}":`, error);
    }
  }
}

const searches = [
  { query: "modern office", saveDir: "assets/office", filename: "workspace" },
  { query: "team collaboration", saveDir: "assets/team", filename: "teamwork" },
  {
    query: "technology innovation",
    saveDir: "assets/tech",
    filename: "innovation",
  },
];

downloadMultipleImages(searches);
```

## 总结

image-search-unsplash MCP
工具为项目提供了快速获取高质量图片的解决方案。通过简单的配置和调用，您就可以在项目中集成专业的图片资源，提升项目的视觉效果和用户体验。

记住要合理使用图片资源，尊重作者版权，并在适当的地方注明图片来源。祝您使用愉快！
