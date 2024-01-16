import { existsSync, mkdirSync, writeFileSync } from "fs";
import { parse } from "path";
import { convertType } from "../util/typeConvert";

export function genReqAndRes(apiConfig: any, output: string, indents: string) {
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
            return `${dsc}${indents}${key}${dto.required?.includes(key) ? "" : "?"}: ${convertType(dto.properties[key].type)};\n`;
        }).join("") : "";
        dts += "}\n\n";
    });
    const outputFile = parse(output);
    if (!existsSync(outputFile.dir)) {
        mkdirSync(outputFile.dir);
    }
    writeFileSync(output, dts, "utf8");
}
