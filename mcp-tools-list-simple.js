#!/usr/bin/env node

/**
 * Claude MCP 工具列表查询器 - 简化版
 * 使用 MCP Inspector CLI 查询所有 MCP 服务器的工具列表
 */

import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import os from "os";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const execAsync = promisify(exec);

// 颜色输出
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, "green");
}
function logError(message) {
  log(`❌ ${message}`, "red");
}
function logInfo(message) {
  log(`ℹ️  ${message}`, "blue");
}
function logWarning(message) {
  log(`⚠️  ${message}`, "yellow");
}

// 读取配置文件
function readClaudeConfig(configPath) {
  try {
    const content = fs.readFileSync(configPath, "utf8");
    return JSON.parse(content);
  } catch (error) {
    logError(`读取配置失败: ${error.message}`);
    process.exit(1);
  }
}

// 使用 SDK 查询 HTTP 服务器
async function queryHttpServerWithSDK(serverName, serverConfig) {
  let client = null;
  let transport = null;

  try {
    logInfo(`连接到 HTTP 服务器: ${serverConfig.url}`);

    // 使用 MCP SDK 的 StreamableHTTPClientTransport
    const url = new URL(serverConfig.url);
    const headers = serverConfig.headers || {};

    transport = new StreamableHTTPClientTransport(url, {
      requestInit: {
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      },
    });

    client = new Client({
      name: "mcp-tools-list-client",
      version: "1.0.0",
    });

    await client.connect(transport);

    // 获取工具列表
    const toolsResult = await client.listTools();

    return {
      serverName,
      success: true,
      tools: toolsResult.tools || [],
      count: toolsResult.tools ? toolsResult.tools.length : 0,
    };
  } catch (error) {
    return {
      serverName,
      success: false,
      error: `HTTP 服务器连接失败: ${error.message}`,
      note: "HTTP 服务器可能需要特定的认证或连接方式",
    };
  } finally {
    // 清理连接
    if (transport) {
      try {
        await transport.close();
      } catch (e) {
        // 忽略清理错误
      }
    }
  }
}

// 查询单个服务器
async function queryServer(serverName, serverConfig, configPath) {
  try {
    logInfo(`查询 ${serverName}...`);

    // 根据服务器类型使用不同的查询方式
    if (
      serverConfig.type === "http" ||
      serverConfig.type === "sse" ||
      serverConfig.type === "streamable-http"
    ) {
      // HTTP 类型服务器使用 SDK
      return await queryHttpServerWithSDK(serverName, serverConfig);
    } else {
      // STDIO 类型服务器使用 Inspector CLI
      const command = `npx -y @modelcontextprotocol/inspector --cli --config "${configPath}" --server "${serverName}" --method tools/list`;

      const { stdout, stderr } = await execAsync(command, {
        timeout: 30000,
        maxBuffer: 1024 * 1024, // 1MB
        env: {
          ...process.env,
          MCP_INSPECTOR_DISABLE_BROWSER: "1",
          CI: "1",
        },
      });

      if (stdout) {
        try {
          const result = JSON.parse(stdout);
          return {
            serverName,
            success: true,
            tools: result.tools || [],
            count: result.tools ? result.tools.length : 0,
          };
        } catch (parseError) {
          return {
            serverName,
            success: false,
            error: "JSON解析失败",
            rawOutput: stdout,
            stderr,
          };
        }
      } else {
        return {
          serverName,
          success: false,
          error: "无输出",
          stderr,
        };
      }
    }
  } catch (error) {
    return {
      serverName,
      success: false,
      error: error.message,
      stderr: error.stderr,
    };
  }
}

// 生成 Markdown 报告
function generateReport(results, configPath) {
  const totalServers = results.length;
  const successfulServers = results.filter((r) => r.success).length;
  const totalTools = results.reduce((sum, r) => sum + (r.count || 0), 0);

  let markdown = `# Claude MCP 工具列表报告 (混合版本)

> 生成时间: ${new Date().toLocaleString("zh-CN")}
> 配置文件: ${configPath}
> 查询方式: HTTP 服务器使用 MCP SDK，STDIO 服务器使用 Inspector CLI

## 📊 统计概览

- **总服务器数**: ${totalServers}
- **成功查询**: ${successfulServers}
- **总工具数**: ${totalTools}

---

## ✅ 成功查询的服务器

`;

  // 按工具数量排序
  const successfulResults = results
    .filter((r) => r.success)
    .sort((a, b) => (b.count || 0) - (a.count || 0));

  successfulResults.forEach((result) => {
    markdown += `### ${result.serverName}

**工具数量**: ${result.count}

| 工具名称 | 描述 |
|----------|------|
`;

    if (result.tools && result.tools.length > 0) {
      result.tools.forEach((tool) => {
        const name = tool.name || "N/A";
        let description = tool.description || "无描述";

        // 处理多行描述，将其转换为单行并转义 Markdown 特殊字符
        const escapedDesc = description
          .replace(/\n+/g, " ") // 将换行符替换为空格
          .replace(/\s+/g, " ") // 将多个空格替换为单个空格
          .replace(/[|`\\]/g, "\\$&") // 转义 Markdown 特殊字符
          .trim(); // 去除首尾空格

        // 限制描述长度，避免表格过宽
        const maxLength = 200000;
        const finalDesc =
          escapedDesc.length > maxLength
            ? escapedDesc.substring(0, maxLength) + "..."
            : escapedDesc;

        markdown += `| \`${name}\` | ${finalDesc} |\n`;
      });
    }
    markdown += "\n";
  });

  // 失败的服务器
  const failedResults = results.filter((r) => !r.success);
  if (failedResults.length > 0) {
    markdown += `## ❌ 查询失败的服务器

`;

    failedResults.forEach((result) => {
      markdown += `### ${result.serverName}

**错误**: ${result.error}

`;
      if (result.stderr) {
        markdown += `**错误输出**:
\`\`\`
${result.stderr}
\`\`\`

`;
      }
    });
  }

  // 工具分类统计
  markdown += `## 🔧 工具分类

`;

  const allTools = [];
  successfulResults.forEach((result) => {
    if (result.tools) {
      result.tools.forEach((tool) => {
        allTools.push({
          ...tool,
          server: result.serverName,
        });
      });
    }
  });

  // 按服务器分组显示工具
  const toolsByServer = {};
  allTools.forEach((tool) => {
    if (!toolsByServer[tool.server]) {
      toolsByServer[tool.server] = [];
    }
    toolsByServer[tool.server].push(tool);
  });

  Object.entries(toolsByServer).forEach(([server, tools]) => {
    markdown += `### ${server} (${tools.length} 个工具)

`;
    tools.forEach((tool) => {
      markdown += `- **\`${tool.name}\`**: ${tool.description}\n`;
    });
    markdown += "\n";
  });

  return markdown;
}

// 主函数
async function main() {
  log("🔍 Claude MCP 工具列表查询器", "cyan");
  log("=====================================", "cyan");

  const configPath = process.argv[2] || path.join(os.homedir(), ".claude.json");

  if (!fs.existsSync(configPath)) {
    logError(`配置文件不存在: ${configPath}`);
    process.exit(1);
  }

  logInfo(`使用配置文件: ${configPath}`);

  const config = readClaudeConfig(configPath);

  if (!config.mcpServers || Object.keys(config.mcpServers).length === 0) {
    logWarning("没有找到 MCP 服务器配置");
    process.exit(0);
  }

  const serverNames = Object.keys(config.mcpServers);
  logInfo(
    `找到 ${serverNames.length} 个 MCP 服务器: ${serverNames.join(", ")}`,
  );

  log("\n🚀 开始查询...", "cyan");
  log("=====================================", "cyan");

  const results = [];

  for (let i = 0; i < serverNames.length; i++) {
    const serverName = serverNames[i];
    const serverConfig = config.mcpServers[serverName];
    log(`[${i + 1}/${serverNames.length}] ${serverName}`, "magenta");

    const result = await queryServer(serverName, serverConfig, configPath);
    results.push(result);

    if (result.success) {
      logSuccess(`${serverName}: ${result.count} 个工具`);
    } else {
      logError(`${serverName}: ${result.error}`);
    }
  }

  // 生成报告
  log("\n📝 生成报告...", "cyan");
  const markdown = generateReport(results, configPath);
  const reportPath =
    "mcp-tools-report-" +
    new Date()
      .toLocaleString()
      .replaceAll(":", "-")
      .replaceAll("+", "-")
      .replaceAll("/", "-") +
    ".md";

  fs.writeFileSync(reportPath, markdown, "utf8");
  logSuccess(`报告已生成: ${reportPath}`);

  // 汇总
  log("\n📋 汇总", "cyan");
  log("=====================================", "cyan");
  const successCount = results.filter((r) => r.success).length;
  const totalCount = results.length;
  const totalToolsCount = results.reduce((sum, r) => sum + (r.count || 0), 0);

  log(`成功查询: ${successCount}/${totalCount} 个服务器`);
  log(`总工具数: ${totalToolsCount}`);
  logSuccess("查询完成！");
  process.exit(0);
}

// 运行
if (import.meta.main) {
  process.on("unhandledRejection", (error) => {
    console.error("unhandledRejection", error);
  });
  process.on("uncaughtException", (error) => {
    console.error("uncaughtException", error);
  });
  main()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      logError(`程序失败: ${error.message}`);
      console.error(error);
      process.exit(1);
    });
}
