import { DateType, StyleType } from "./enum";

export class PluginSettings {
    dateFormat: DateType;
    momentPath: string;
    memoPath: string;
    titleSize: number;
    mapKey: string;
    defaultCity: string;
    defaultWeather: string;
    styleType: StyleType;
    transfer: string;
    memoTransfer: string;


    constructor() {
        this.dateFormat = DateType.Lunar;
        this.momentPath = "";
        this.memoPath = "";
        this.titleSize = 3;
        this.mapKey = "";
        this.defaultCity = '河北 衡水';
        this.defaultWeather = '雨';
        this.styleType = StyleType.Simple;
        this.transfer = "";
        this.memoTransfer = "";

    }

    static getDefaultSettings(): PluginSettings {
        return new PluginSettings();
    }

    updateSettings(newSettings: Partial<PluginSettings>): void {
        Object.assign(this, newSettings);
    }
}