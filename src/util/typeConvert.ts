const typeMap = new Map<string, string>;
typeMap.set("integer", "number");
typeMap.set("string", "string");
typeMap.set("Date", "Date");
typeMap.set("DateTime", "string");
typeMap.set("BigDecimal", "string");

export function convertType(inputType: string): string {
    if (inputType === undefined) return "any";
    return typeMap.get(inputType.toLowerCase()) || inputType.toLowerCase();
}
