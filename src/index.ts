#!/usr/bin/env node

import { program } from "commander";
import { loadOpenApiJson } from "./util/loadOpenApiJson";
import { genReqAndRes } from "./commands/genReqAndRes";

export const logger = console;

export const config = {
    /**
     * 缩进
     */
    indents: "    "
};

/**
 * 生成ts文件
 */
program
    .command("gen")
    .description("通过openApi生成对应的ts定义文件")
    .option("-u, --url <url>", `openApi json文档地址，可以是http地址，也可以是本地文件路径（相对项目运行路径查找）`, "api-docs.json")
    .option("-o, --output <output>", "输出文件路径", "./api.d.ts")
    .action(async function(options) {
        logger.info(`加载openApi文档中...`);
        const apiConfig = await loadOpenApiJson(options.url);
        logger.info(`openApi文档加载成功，开始生成openApi文档到${options.output}文件中...`);
        genReqAndRes(apiConfig, options.output, config.indents);
        logger.info(`openApi文档生成成功！`);
    });

program.parse(process.argv);
