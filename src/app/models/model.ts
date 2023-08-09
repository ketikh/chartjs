export class ChartModel {
    name: string;
    data: ChartDataModel[];
    min: 10;
    max: 50;
}

export class ChartDataModel {
    key: Date;
    value: number;
    unit: string;
}