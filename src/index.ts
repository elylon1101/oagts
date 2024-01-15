#!/usr/bin/env node

import { program } from "commander";
import { generate } from "./commands/generate";

export const logger = console;

/**
 * 生成ts文件
 */
program
    .command("gen")
    .description("通过openApi生成对应的ts定义文件")
    .option("-u, --url <url>", `openApi json文档地址，可以是http地址，也可以是本地文件路径（相对项目运行路径查找）`, "api-docs.json")
    .option("-o, --output <output>", "输出文件路径", "./api.d.ts")
    .action(async function(options) {
        await generate(options.url, options.output);
    });

program.parse(process.argv);
