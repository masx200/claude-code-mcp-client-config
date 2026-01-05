#!/usr/bin/env node

import fs from "fs";
import path from "path";
import os from "os";
import { spawn } from "child_process";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

// 获取当前文件的目录

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

// 执行安装命令
function executeInstallCommand(command) {
  return new Promise((resolve, reject) => {
    console.log(`执行安装命令: ${command}`);

    // 根据操作系统选择shell
    const platform = os.platform();
    const shell = platform === "win32" ? "cmd.exe" : "bash";
    const shellArgs = platform === "win32" ? ["/c", command] : ["-c", command];

    const child = spawn(shell, shellArgs, {
      stdio: "inherit",
      shell: true,
    });

    child.on("close", (code) => {
      if (code === 0) {
        console.log(`安装命令执行成功`);
        resolve();
      } else {
        console.error(`安装命令执行失败，退出码: ${code}`);
        reject(new Error(`安装命令执行失败，退出码: ${code}`));
      }
    });

    child.on("error", (error) => {
      console.error(`执行安装命令时出错:`, error.message);
      reject(error);
    });
  });
}

// 获取平台特定的安装命令
function getPlatformInstallCommand(installCommand) {
  const platform = os.platform();

  // 如果是字符串，直接返回
  if (typeof installCommand === "string") {
    return installCommand;
  }

  // 如果是对象，根据平台返回对应的命令
  if (typeof installCommand === "object") {
    if (platform === "win32" && installCommand.windows) {
      return installCommand.windows;
    } else if (platform === "darwin" && installCommand.mac) {
      return installCommand.mac;
    } else if (platform === "linux" && installCommand.linux) {
      return installCommand.linux;
    }
    // 如果没有找到匹配的平台，尝试使用通用命令
    if (installCommand.default) {
      return installCommand.default;
    }
  }

  return null;
}

// 安装MCP服务器
async function installMcpServers(
  mcpServers,
  skipInstall = false,
  configFilePath = null,
) {
  if (skipInstall) {
    console.log("跳过安装步骤");
    return;
  }

  const installPromises = [];
  // 获取配置文件所在目录的绝对路径
  const workingDir = configFilePath
    ? path.dirname(path.resolve(configFilePath))
    : process.cwd();

  for (const [serverName, serverConfig] of Object.entries(mcpServers)) {
    if (serverConfig.installCommand) {
      // 获取平台特定的安装命令
      const platformCommand = getPlatformInstallCommand(
        serverConfig.installCommand,
      );

      if (!platformCommand) {
        console.warn(`${serverName}: 没有找到适合当前平台的安装命令`);
        continue;
      }

      console.log(`准备安装 ${serverName}...`);

      // 替换 ${pwd} 为工作目录的绝对路径
      const replacedCommand = platformCommand.replace(/\$\{pwd\}/g, workingDir);

      installPromises.push(
        executeInstallCommand(replacedCommand)
          .then(() => console.log(`${serverName} 安装完成`))
          .catch((error) =>
            console.warn(`${serverName} 安装失败:`, error.message)
          ),
      );
    }
  }

  if (installPromises.length > 0) {
    console.log("开始安装MCP服务器...");
    await Promise.all(installPromises);
    console.log("所有安装命令执行完成");
  } else {
    console.log("没有需要安装的MCP服务器");
  }
}

// 合并MCP服务器配置
function mergeMcpServers(existingConfig, newConfig, workingDir = null) {
  const result = { ...existingConfig };

  // 确保mcpServers对象存在
  if (!result.mcpServers) {
    result.mcpServers = {};
  }

  // 合并新的mcpServers配置
  if (newConfig.mcpServers) {
    for (
      const [serverName, serverConfig] of Object.entries(
        newConfig.mcpServers,
      )
    ) {
      // 克隆服务器配置
      const mergedConfig = { ...serverConfig };

      // 如果有工作目录，替换配置中的 ${pwd} 占位符
      if (workingDir && mergedConfig.args) {
        mergedConfig.args = mergedConfig.args.map((arg) => {
          // 替换路径中的 ${pwd}
          if (typeof arg === "string" && arg.includes("${pwd}")) {
            return arg.replace(/\$\{pwd\}/g, workingDir);
          }
          return arg;
        });
      }

      result.mcpServers[serverName] = mergedConfig;
    }
  }

  return result;
}

// 读取和解析配置文件或字符串
function loadConfig(input) {
  if (fs.existsSync(input)) {
    console.log(`从文件读取配置: ${input}`);
    return readJsonFile(input);
  } else {
    try {
      console.log("解析JSON字符串...");
      return JSON.parse(input);
    } catch (error) {
      console.error("JSON字符串解析失败:", error.message);
      process.exit(1);
    }
  }
}

// 主函数
async function main() {
  const argv = await yargs(hideBin(process.argv))
    .usage("MCP配置合并工具 - 自动安装并合并多个MCP服务器配置")
    .scriptName("merge-mcp-config")
    .command("$0 <inputs..>", "合并MCP服务器配置", (yargs) => {
      return yargs.positional("inputs", {
        describe: "配置文件路径或JSON字符串",
        type: "string",
        array: true,
      });
    })
    .option("skip-install", {
      alias: "no-install",
      describe: "跳过MCP服务器的自动安装",
      type: "boolean",
      default: false,
    })
    .option("verbose", {
      alias: "v",
      describe: "显示详细输出",
      type: "boolean",
      default: false,
    })
    .option("dry-run", {
      describe: "预览模式，不实际修改配置文件",
      type: "boolean",
      default: false,
    })
    .help("help")
    .alias("help", "h")
    .version("1.0.0")
    .alias("version", "V")
    .example([
      ["config.json", "从文件合并配置"],
      ["config1.json config2.json", "合并多个配置文件"],
      ["config.json --skip-install", "跳过安装步骤"],
      ["config.json --dry-run", "预览模式，不实际修改配置"],
      ['\'{"mcpServers": {"server1": {...}}}\'', "从JSON字符串合并"],
    ])
    .demandCommand(1, "请提供至少一个配置文件路径或JSON字符串")
    .strict().argv;

  const { inputs, skipInstall, verbose, dryRun } = argv;

  if (verbose) {
    console.log(`输入参数: ${inputs.join(", ")}`);
    console.log(`跳过安装: ${skipInstall}`);
    console.log(`预览模式: ${dryRun}`);
  }

  // 加载并合并所有配置
  let mergedNewConfig = { mcpServers: {} };
  const allMcpServers = {};
  const configFilesPaths = [];

  for (const input of inputs) {
    const isFile = fs.existsSync(input);
    const configFilePath = isFile ? path.resolve(input) : null;

    if (configFilePath) {
      configFilesPaths.push(configFilePath);
    }

    const config = loadConfig(input);

    // 验证输入的配置格式
    if (!config.mcpServers || typeof config.mcpServers !== "object") {
      console.error("错误: 输入的配置必须包含 mcpServers 对象");
      process.exit(1);
    }

    // 收集所有需要安装的服务器
    Object.assign(allMcpServers, config.mcpServers);

    // 获取配置文件所在目录
    const workingDir = path.dirname(
      configFilePath ? path.dirname(configFilePath) : process.cwd(),
    );

    // 合并配置，并替换 ${pwd} 为绝对路径
    mergedNewConfig = mergeMcpServers(mergedNewConfig, config, workingDir);
  }

  // 安装MCP服务器（传入配置文件路径）
  if (Object.keys(allMcpServers).length > 0) {
    // 使用第一个配置文件所在的目录作为工作目录
    const firstConfigPath = configFilesPaths.length > 0
      ? configFilesPaths[0]
      : null;
    await installMcpServers(allMcpServers, skipInstall, firstConfigPath);
  }

  if (dryRun) {
    console.log("\n=== 预览模式 ===");
    console.log("将要合并的MCP服务器:");
    Object.keys(mergedNewConfig.mcpServers || {}).forEach((serverName) => {
      console.log(`  - ${serverName}`);
    });
    console.log("配置文件未被修改。");
    return;
  }

  // 读取现有的Claude配置
  console.log(`读取现有的Claude配置: ${CLAUDE_CONFIG_PATH}`);
  const existingConfig = readJsonFile(CLAUDE_CONFIG_PATH);

  // 合并配置
  console.log("合并配置...");
  const finalConfig = mergeMcpServers(existingConfig, mergedNewConfig);

  // 创建备份
  if (Object.keys(existingConfig).length > 0) {
    const backupPath = `${CLAUDE_CONFIG_PATH}.backup.${Date.now()}`;
    console.log(`创建备份: ${backupPath}`);
    writeJsonFile(backupPath, existingConfig);
  }

  // 写入合并后的配置
  writeJsonFile(CLAUDE_CONFIG_PATH, finalConfig);

  console.log("\n合并完成!");
  console.log("现有的MCP服务器:");
  Object.keys(finalConfig.mcpServers || {}).forEach((serverName) => {
    console.log(`  - ${serverName}`);
  });
}
if (import.meta.main) {
  // 运行主函数
  main();
}
