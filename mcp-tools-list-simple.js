#!/usr/bin/env node

/**
 * Claude MCP 工具列表查询器 - 简化版
 * 使用 MCP Inspector CLI 查询所有 MCP 服务器的工具列表
 */

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import os from 'os';

const execAsync = promisify(exec);

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) { log(`✅ ${message}`, 'green'); }
function logError(message) { log(`❌ ${message}`, 'red'); }
function logInfo(message) { log(`ℹ️  ${message}`, 'blue'); }
function logWarning(message) { log(`⚠️  ${message}`, 'yellow'); }

// 读取配置文件
function readClaudeConfig(configPath) {
  try {
    const content = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    logError(`读取配置失败: ${error.message}`);
    process.exit(1);
  }
}

// 查询单个服务器
async function queryServer(serverName, serverConfig, configPath) {
  try {
    logInfo(`查询 ${serverName}...`);

    let command;

    // 根据服务器类型使用不同的查询方式
    if (serverConfig.type === 'http' || serverConfig.type === 'sse' || serverConfig.type === 'streamable-http') {
      // HTTP 类型服务器使用 transport 参数直接连接
      const transportType = serverConfig.type === 'streamable-http' ? 'http' : serverConfig.type;
      command = `npx -y @modelcontextprotocol/inspector --cli "${serverConfig.url}" --transport ${transportType} --method tools/list`;

      // 添加认证头的环境变量（如果支持）
      const env = {
        ...process.env,
        MCP_INSPECTOR_DISABLE_BROWSER: '1',
        CI: '1'
      };

      // 如果有认证头，尝试添加到环境变量
      if (serverConfig.headers && serverConfig.headers.Authorization) {
        // 某些 MCP 客户端可能支持通过环境变量传递认证
        env.MCP_AUTH_TOKEN = serverConfig.headers.Authorization.replace('Bearer ', '');
        logWarning(`HTTP 服务器 ${serverName} 使用 Bearer token 认证`);
      }

      try {
        const { stdout, stderr } = await execAsync(command, {
          timeout: 30000,
          maxBuffer: 1024 * 1024,
          env
        });

        if (stdout) {
          try {
            const result = JSON.parse(stdout);
            return {
              serverName,
              success: true,
              tools: result.tools || [],
              count: result.tools ? result.tools.length : 0
            };
          } catch (parseError) {
            return {
              serverName,
              success: false,
              error: 'JSON解析失败',
              rawOutput: stdout,
              stderr
            };
          }
        } else {
          return {
            serverName,
            success: false,
            error: '无输出',
            stderr
          };
        }
      } catch (httpError) {
        // 如果 transport 方法失败，记录具体错误
        return {
          serverName,
          success: false,
          error: `HTTP 服务器查询失败: ${httpError.message}`,
          stderr: httpError.stderr,
          note: 'HTTP 服务器在 CLI 模式下可能需要通过 Web 界面访问'
        };
      }
    } else {
      // STDIO 类型服务器使用配置文件
      command = `npx -y @modelcontextprotocol/inspector --cli --config "${configPath}" --server "${serverName}" --method tools/list`;
    }

    const { stdout, stderr } = await execAsync(command, {
      timeout: 30000,
      maxBuffer: 1024 * 1024, // 1MB
      env: {
        ...process.env,
        MCP_INSPECTOR_DISABLE_BROWSER: '1',
        CI: '1'
      }
    });

    if (stdout) {
      try {
        const result = JSON.parse(stdout);
        return {
          serverName,
          success: true,
          tools: result.tools || [],
          count: result.tools ? result.tools.length : 0
        };
      } catch (parseError) {
        return {
          serverName,
          success: false,
          error: 'JSON解析失败',
          rawOutput: stdout,
          stderr
        };
      }
    } else {
      return {
        serverName,
        success: false,
        error: '无输出',
        stderr
      };
    }
  } catch (error) {
    return {
      serverName,
      success: false,
      error: error.message,
      stderr: error.stderr
    };
  }
}

// 生成 Markdown 报告
function generateReport(results, configPath) {
  const totalServers = results.length;
  const successfulServers = results.filter(r => r.success).length;
  const totalTools = results.reduce((sum, r) => sum + (r.count || 0), 0);

  let markdown = `# Claude MCP 工具列表报告

> 生成时间: ${new Date().toLocaleString('zh-CN')}
> 配置文件: ${configPath}

## 📊 统计概览

- **总服务器数**: ${totalServers}
- **成功查询**: ${successfulServers}
- **总工具数**: ${totalTools}

---

## ✅ 成功查询的服务器

`;

  // 按工具数量排序
  const successfulResults = results
    .filter(r => r.success)
    .sort((a, b) => (b.count || 0) - (a.count || 0));

  successfulResults.forEach(result => {
    markdown += `### ${result.serverName}

**工具数量**: ${result.count}

| 工具名称 | 描述 |
|----------|------|
`;

    if (result.tools && result.tools.length > 0) {
      result.tools.forEach(tool => {
        const name = tool.name || 'N/A';
        const description = tool.description || '无描述';
        // 转义 Markdown 特殊字符
        const escapedDesc = description.replace(/[|`\\]/g, '\\$&');
        markdown += `| \`${name}\` | ${escapedDesc} |\n`;
      });
    }
    markdown += '\n';
  });

  // 失败的服务器
  const failedResults = results.filter(r => !r.success);
  if (failedResults.length > 0) {
    markdown += `## ❌ 查询失败的服务器

`;

    failedResults.forEach(result => {
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
  successfulResults.forEach(result => {
    if (result.tools) {
      result.tools.forEach(tool => {
        allTools.push({
          ...tool,
          server: result.serverName
        });
      });
    }
  });

  // 按服务器分组显示工具
  const toolsByServer = {};
  allTools.forEach(tool => {
    if (!toolsByServer[tool.server]) {
      toolsByServer[tool.server] = [];
    }
    toolsByServer[tool.server].push(tool);
  });

  Object.entries(toolsByServer).forEach(([server, tools]) => {
    markdown += `### ${server} (${tools.length} 个工具)

`;
    tools.forEach(tool => {
      markdown += `- **\`${tool.name}\`**: ${tool.description}\n`;
    });
    markdown += '\n';
  });

  return markdown;
}

// 主函数
async function main() {
  log('🔍 Claude MCP 工具列表查询器', 'cyan');
  log('=====================================', 'cyan');

  const configPath = process.argv[2] || path.join(require('os').homedir(), '.claude.json');

  if (!fs.existsSync(configPath)) {
    logError(`配置文件不存在: ${configPath}`);
    process.exit(1);
  }

  logInfo(`使用配置文件: ${configPath}`);

  const config = readClaudeConfig(configPath);

  if (!config.mcpServers || Object.keys(config.mcpServers).length === 0) {
    logWarning('没有找到 MCP 服务器配置');
    process.exit(0);
  }

  const serverNames = Object.keys(config.mcpServers);
  logInfo(`找到 ${serverNames.length} 个 MCP 服务器: ${serverNames.join(', ')}`);

  log('\n🚀 开始查询...', 'cyan');
  log('=====================================', 'cyan');

  const results = [];

  for (let i = 0; i < serverNames.length; i++) {
    const serverName = serverNames[i];
    const serverConfig = config.mcpServers[serverName];
    log(`[${i + 1}/${serverNames.length}] ${serverName}`, 'magenta');

    const result = await queryServer(serverName, serverConfig, configPath);
    results.push(result);

    if (result.success) {
      logSuccess(`${serverName}: ${result.count} 个工具`);
    } else {
      logError(`${serverName}: ${result.error}`);
    }
  }

  // 生成报告
  log('\n📝 生成报告...', 'cyan');
  const markdown = generateReport(results, configPath);
  const reportPath = 'mcp-tools-report.md';

  fs.writeFileSync(reportPath, markdown, 'utf8');
  logSuccess(`报告已生成: ${reportPath}`);

  // 汇总
  log('\n📋 汇总', 'cyan');
  log('=====================================', 'cyan');
  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;
  const totalToolsCount = results.reduce((sum, r) => sum + (r.count || 0), 0);

  log(`成功查询: ${successCount}/${totalCount} 个服务器`);
  log(`总工具数: ${totalToolsCount}`);
  logSuccess('查询完成！');
}

// 运行
if (import.meta.main) {
  main().catch(error => {
    logError(`程序失败: ${error.message}`);
    console.error(error);
    process.exit(1);
  });
}