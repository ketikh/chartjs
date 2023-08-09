export class Colors {
    static colors: string[] = ['#F4A460',
    '#FFB6C1',
    '#87CEEB',
    '#90EE90',
    '#FFD700',
    '#DA70D6',
    '#D3D3D3',
    '#000000',
    '#FFFFFF',];
    static colorsV2: ColorsV2[] = [
        { Prognose: '#F4A460', Fact: '#8B4513' }, // Light Brown, Dark Brown
        { Prognose: '#FFB6C1', Fact: '#FF69B4' }, // Light Pink, Dark Pink
        { Prognose: '#87CEEB', Fact: '#00688B' }, // Light Blue, Dark Blue
        { Prognose: '#90EE90', Fact: '#008000' }, // Light Green, Dark Green
        { Prognose: '#FFD700', Fact: '#FF8C00' }, // Light Orange, Dark Orange
        { Prognose: '#DA70D6', Fact: '#8B008B' }, // Light Purple, Dark Purple
        { Prognose: '#D3D3D3', Fact: '#A9A9A9' }, // Light Gray, Dark Gray
        { Prognose: '#000000', Fact: '#333333' }, // Light Black, Dark Black
        { Prognose: '#FFFFFF', Fact: '#F5F5F5' },  // Light White, Dark White
    
    ];
    constructor() { }
    static getColorsByIndex(index: number) {
        return this.colors[index];
    }
    static getColorsByIndexV2(index: number) {
        return this.colorsV2[index];
    }
}


export class ColorsV2 {
    Prognose: string;
    Fact: string;
}