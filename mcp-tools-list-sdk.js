#!/usr/bin/env node

/**
 * Claude MCP 工具列表查询器 - SDK 版本
 * 使用 MCP TypeScript SDK 直接查询 MCP 服务器的工具列表
 */

import fs from "fs";
import path from "path";
import os from "os";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

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

// 客户端管理器 - 用于跟踪所有活跃的连接
class ClientManager {
  constructor() {
    this.clients = new Set();
    this.transports = new Set();
    this.stdioProcesses = new Set(); // 跟踪STDIO进程
  }

  addClient(client, transport) {
    this.clients.add(client);
    this.transports.add(transport);
  }

  addStdioProcess(process) {
    this.stdioProcesses.add(process);
  }

  async closeAll() {
    // 如果没有连接需要关闭，直接返回
    if (
      this.clients.size === 0 &&
      this.transports.size === 0 &&
      this.stdioProcesses.size === 0
    ) {
      return;
    }

    logInfo("正在关闭所有 MCP 客户端连接...");

    const closePromises = [];

    // 先关闭所有传输
    for (const transport of this.transports) {
      closePromises.push(
        transport.close().catch((e) => {
          // 忽略关闭错误
        }),
      );
    }

    // 等待传输关闭
    try {
      await Promise.all(closePromises);
    } catch (error) {
      // 忽略关闭错误
    }

    // 强制终止所有STDIO进程
    for (const proc of this.stdioProcesses) {
      try {
        if (proc && !proc.killed) {
          proc.kill("SIGTERM");
          // 给进程一些时间来优雅关闭
          setTimeout(() => {
            if (!proc.killed) {
              proc.kill("SIGKILL");
            }
          }, 1000);
        }
      } catch (e) {
        // 忽略终止错误
      }
    }

    // 等待一小段时间确保进程完全终止
    await new Promise((resolve) => setTimeout(resolve, 1500));

    logSuccess("所有 MCP 客户端连接已优雅关闭");

    // 清空集合
    this.clients.clear();
    this.transports.clear();
    this.stdioProcesses.clear();
  }
}

// 全局客户端管理器
const clientManager = new ClientManager();

// 查询单个服务器
async function queryServer(serverName, serverConfig, configPath) {
  let client = null;
  let transport = null;

  try {
    logInfo(`查询 ${serverName}...`);

    // 根据服务器类型创建不同的传输
    if (
      serverConfig.type === "http" ||
      serverConfig.type === "sse" ||
      serverConfig.type === "streamable-http"
    ) {
      // HTTP 类型服务器
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
        transport.onerror = (error) => {
          console.error("Transport error:", error.message);
        };
        client = new Client({
          name: "mcp-tools-list-client",
          version: "1.0.0",
        });

        await client.connect(transport);

        // 注册到管理器
        clientManager.addClient(client, transport);

        // 获取工具列表
        const toolsResult = await client.listTools();

        return {
          serverName,
          success: true,
          tools: toolsResult.tools || [],
          count: toolsResult.tools ? toolsResult.tools.length : 0,
        };
      } catch (httpError) {
        return {
          serverName,
          success: false,
          error: `HTTP 服务器连接失败: ${httpError.message}`,
          note: "HTTP 服务器可能需要特定的认证或连接方式",
        };
      }
    } else {
      // STDIO 类型服务器
      const command = serverConfig.command || "node";
      const args = serverConfig.args || [];
      const env = { ...process.env, ...serverConfig.env };

      transport = new StdioClientTransport({
        command,
        args,
        env,
      });
      transport.onerror = (error) => {
        console.error("Transport error:", error.message);
      };

      // 获取底层的进程引用（如果可用）
      if (transport._process) {
        clientManager.addStdioProcess(transport._process);
      }

      client = new Client({
        name: "mcp-tools-list-client",
        version: "1.0.0",
      });

      await client.connect(transport);

      // 注册到管理器
      clientManager.addClient(client, transport);

      // 获取工具列表
      const toolsResult = await client.listTools();

      return {
        serverName,
        success: true,
        tools: toolsResult.tools || [],
        count: toolsResult.tools ? toolsResult.tools.length : 0,
      };
    }
  } catch (error) {
    return {
      serverName,
      success: false,
      error: error.message,
      stderr: error.stderr,
      note:
        serverConfig.type === "http"
          ? "HTTP 服务器可能需要特定的认证或连接方式"
          : undefined,
    };
  } finally {
    // 不在这里立即清理，由管理器统一处理
    // 但是对于失败的情况，仍需要清理当前连接
    if (transport && !client) {
      try {
        await transport.close();
      } catch (e) {
        // 忽略清理错误
      }
    }
  }
}

// 生成 Markdown 报告
function generateReport(results, configPath) {
  const totalServers = results.length;
  const successfulServers = results.filter((r) => r.success).length;
  const totalTools = results.reduce((sum, r) => sum + (r.count || 0), 0);

  let markdown = `# Claude MCP 工具列表报告 (SDK 版本)

> 生成时间: ${new Date().toLocaleString("zh-CN")}
> 配置文件: ${configPath}
> 查询方式: MCP TypeScript SDK

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
      if (result.note) {
        markdown += `**说明**: ${result.note}

`;
      }
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
  log("🔍 Claude MCP 工具列表查询器 (SDK 版本)", "cyan");
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

  try {
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
      "mcp-tools-report-sdk-" +
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
  } catch (error) {
    logError(`程序执行过程中出错: ${error.message}`);
    throw error;
  } finally {
    // 优雅关闭所有连接
    await clientManager.closeAll();
  }
}

// 优雅退出处理函数
async function gracefulExit(signal) {
  logInfo(`收到 ${signal} 信号，开始优雅退出...`);
  try {
    await clientManager.closeAll();
    logSuccess("优雅退出完成");
    process.exit(0);
  } catch (error) {
    logError(`优雅退出失败: ${error.message}`);
    process.exit(1);
  }
}

// 运行
if (import.meta.main) {
  // 重写console.error以抑制EPIPE错误
  const originalConsoleError = console.error;
  console.error = (...args) => {
    const message = args.join(" ");
    if (message.includes("EPIPE") || message.includes("broken pipe")) {
      return; // 静默处理管道错误
    }
    originalConsoleError.apply(console, args);
  };

  // 抑制STDIO错误输出
  process.on("unhandledRejection", (error) => {
    if (error.code === "EPIPE" || error.message.includes("EPIPE")) {
      // 静默处理EPIPE错误
      return;
    }
    console.error("unhandledRejection", error);
  });

  process.on("uncaughtException", (error) => {
    if (error.code === "EPIPE" || error.message.includes("EPIPE")) {
      // 静默处理EPIPE错误
      return;
    }
    console.error("uncaughtException", error);
  });

  // 抑制STDIO错误事件
  process.on("message", (msg) => {
    if (msg && msg.type === "stderr" && msg.data.includes("EPIPE")) {
      // 静默处理STDIO的EPIPE错误
      return;
    }
  });

  // 监听退出信号
  process.on("SIGINT", () => gracefulExit("SIGINT"));
  process.on("SIGTERM", () => gracefulExit("SIGTERM"));

  // 监听进程退出事件
  process.on("exit", (code) => {
    if (code === 0) {
      logSuccess("程序正常退出");
      process.exit(0);
    } else {
      logError(`程序异常退出，代码: ${code}`);
    }
  });

  // 立即设置退出处理
  let isExiting = false;
  const safeExit = async (code) => {
    if (isExiting) return;
    isExiting = true;

    try {
      await clientManager.closeAll();
    } catch (e) {
      // 忽略关闭错误
    }

    process.exit(code);
  };

  main()
    .then(() => {
      safeExit(0);
      process.exit(0);
    })
    .catch((error) => {
      if (error.code !== "EPIPE") {
        logError(`程序失败: ${error.message}`);
      }
      safeExit(1);
    });
}
