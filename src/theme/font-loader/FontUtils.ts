

export default class FontUtils {

    static fontWeightMap = new Map<number, string>([
        [900, 'Black'],
        [800, 'ExtraBold'],
        [700, 'Bold'],
        [600, 'SemiBold'],
        [500, 'Medium'],
        [400, 'Regular'],
        [300, 'Light'],
        [200, 'ExtraLight'],
        [100, 'Thin'],
    ]);

    // Exo new URL(`../assets/icons/${name}.svg`, import.meta.url)
    static createFontfaceString(fontName: string) {
        const result = Array.from(this.fontWeightMap.entries()).reduce<string[]>((p, [ck, cv]) => {
            p.push(`
                @font-face {
                    font-family: '${fontName}';
                    font-style: normal;
                    font-weight: ${ck};
                    src: url(../assets/fonts/${fontName}/${fontName}-${cv}.ttf) format('truetype');
                }

                @font-face {
                    font-family: '${fontName}';
                    font-style: italic;
                    font-weight: ${ck};
                    src: url(../assets/fonts/${fontName}/${fontName}-${cv}Italic.ttf) format('truetype');
                }
            `)
            return p;
        }, [])

        return result.join(' ');
    }
}