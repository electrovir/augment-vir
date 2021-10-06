export function getRepoRootDir(): string {
    return __dirname.replace(/(?:src|node_modules\/augment-vir|dist).*/, '');
}
