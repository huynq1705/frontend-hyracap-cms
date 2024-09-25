
const _global: any = window;
_global.AbsolutePath = (path: string) => {
    return new URL(path, import.meta.url).href;
}