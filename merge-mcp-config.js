#!/usr/bin/env node

import fs from "fs";
import path from "path";
import os from "os";
import { fileURLToPath } from "url";

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Claude配置文件路径
const CLAUDE_CONFIG_PATH = path.join(os.homedir(), ".claude.json");

// 读取JSON文件
function readJsonFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return {};
    }
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`读取文件 ${filePath} 失败:`, error.message);
    process.exit(1);
  }
}

// 写入JSON文件
function writeJsonFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
    console.log(`配置已成功写入到 ${filePath}`);
  } catch (error) {
    console.error(`写入文件 ${filePath} 失败:`, error.message);
    process.exit(1);
  }
}

// 合并MCP服务器配置
function mergeMcpServers(existingConfig, newConfig) {
  const result = { ...existingConfig };

  // 确保mcpServers对象存在
  if (!result.mcpServers) {
    result.mcpServers = {};
  }

  // 合并新的mcpServers配置
  if (newConfig.mcpServers) {
    result.mcpServers = {
      ...result.mcpServers,
      ...newConfig.mcpServers,
    };
  }

  return result;
}

// 主函数
function main() {
  // 获取命令行参数
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("使用方法:");
    console.log("  node merge-mcp-config.js <输入的JSON文件路径>");
    console.log("  node merge-mcp-config.js <JSON字符串>");
    console.log("");
    console.log("示例:");
    console.log("  node merge-mcp-config.js config.json");
    console.log(
      '  node merge-mcp-config.js \'{"mcpServers": {"server1": {...}}}}\'',
    );
    process.exit(1);
  }

  const input = args[0];
  let newConfig;

  // 判断输入是文件路径还是JSON字符串
  if (fs.existsSync(input)) {
    console.log(`从文件读取配置: ${input}`);
    newConfig = readJsonFile(input);
  } else {
    try {
      console.log("解析JSON字符串...");
      newConfig = JSON.parse(input);
    } catch (error) {
      console.error("JSON字符串解析失败:", error.message);
      process.exit(1);
    }
  }

  // 验证输入的配置格式
  if (!newConfig.mcpServers || typeof newConfig.mcpServers !== "object") {
    console.error("错误: 输入的配置必须包含 mcpServers 对象");
    process.exit(1);
  }

  // 读取现有的Claude配置
  console.log(`读取现有的Claude配置: ${CLAUDE_CONFIG_PATH}`);
  const existingConfig = readJsonFile(CLAUDE_CONFIG_PATH);

  // 合并配置
  console.log("合并配置...");
  const mergedConfig = mergeMcpServers(existingConfig, newConfig);

  // 创建备份
  if (Object.keys(existingConfig).length > 0) {
    const backupPath = `${CLAUDE_CONFIG_PATH}.backup.${Date.now()}`;
    console.log(`创建备份: ${backupPath}`);
    writeJsonFile(backupPath, existingConfig);
  }

  // 写入合并后的配置
  writeJsonFile(CLAUDE_CONFIG_PATH, mergedConfig);

  console.log("\n合并完成!");
  console.log("现有的MCP服务器:");
  Object.keys(mergedConfig.mcpServers || {}).forEach((serverName) => {
    console.log(`  - ${serverName}`);
  });
}

// 运行主函数
main();
