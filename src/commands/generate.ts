import { logger } from "../index";
import * as https from "https";
import * as http from "http";
import JSON5 from "json5";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { parse, resolve } from "path";

/**
 * 缩进
 */
const indents = "    ";

/**
 * 生成对应ts定义文件
 * @param jsonUrl openApi json文档地址
 * @param output
 */
export async function generate(jsonUrl: string, output: string) {
    logger.log("开始生成");
    const apiConfig = await loadOpenApiJSON(jsonUrl);
    let dts: string = "";
    Object.keys(apiConfig.components.schemas).forEach(dtoName => {
        const dto = apiConfig.components.schemas[dtoName];
        // 判断是否有注释
        if (dto.description) {
            dts += `/**\n * ${dto.description}\n */\n`;
        }
        dts += `export interface ${dtoName} {\n`;
        dts += dto.properties ? Object.keys(dto.properties).map(key => {
            let dsc = "";
            // 判断字段是否有注释
            if (dto.properties[key].description) {
                dsc = `${indents}/**\n${indents} * ${dto.properties[key].description}\n${indents} */\n`;
            }
            return `${dsc}${indents}${key}${dto.required?.includes(key) ? "" : "?"}: ${dto.properties[key].type};\n`;
        }).join("") : "";
        dts += "}\n\n";
    });
    const outputFile = parse(output);
    if (!existsSync(outputFile.dir)) {
        mkdirSync(outputFile.dir);
    }

    writeFileSync(output, dts, "utf8");
    logger.log("生成完成");
}

/**
 * 获取openApi文档
 * @param jsonUrl openApi json文档地址
 */
async function loadOpenApiJSON(jsonUrl: string) {
    let jsonData: any = {};
    // 判断是否是远程地址
    if (jsonUrl.startsWith("https")) {
        const jsonString = await httpGet(https, jsonUrl);
        jsonData = JSON5.parse(jsonString);
    } else if (jsonUrl.startsWith("http")) {
        const jsonString = await httpGet(http, jsonUrl);
        jsonData = JSON5.parse(jsonString);
    } else {
        // 获取本地文档
        const jsonString = readFileSync(resolve(process.cwd(), jsonUrl), "utf8");
        jsonData = JSON5.parse(jsonString);
    }
    return jsonData;
}

async function httpGet(client: typeof https | typeof http, url: string): Promise<any> {
    return new Promise((resolve, reject) => {
        client.get(url, (res: http.IncomingMessage) => {
            let b = "";
            res.on("data", function(c) {
                b += c;
            });
            res.on("end", function() {
                resolve(b);
            });
        });
    });
}
