

export default class Path {
    static get(pathName: string) {
        return `${new URL(pathName, import.meta.url).href}`;
    }
}
