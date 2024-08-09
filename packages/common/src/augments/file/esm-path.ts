export function getEsmPath(importMeta: ImportMeta): {filePath: string; dirPath: string} {
    const filePath = new URL('', importMeta.url).pathname;
    const dirPath = new URL('.', importMeta.url).pathname;

    return {
        filePath,
        dirPath,
    };
}
