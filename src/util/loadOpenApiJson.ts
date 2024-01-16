import * as https from "https";
import * as http from "http";
import JSON5 from "json5";
import { readFileSync } from "fs";
import { resolve } from "path";

export async function loadOpenApiJson(jsonUrl: string): Promise<any> {
    let jsonData: any = {};
    // 判断是否是远程地址
    if (jsonUrl.startsWith("https")) {
        jsonData = JSON5.parse(await httpGet(https, jsonUrl));
    } else if (jsonUrl.startsWith("http")) {
        jsonData = JSON5.parse(await httpGet(http, jsonUrl));
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
