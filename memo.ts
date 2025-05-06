import {App} from 'obsidian';
import {Solar} from 'lunar-typescript';
import {PluginSettings} from "./settings";
import { CommonHandler } from 'commonHandler';

export class Memo {

    MAP_URL: string = 'https://restapi.amap.com/v3/';
    app: App;
    settings: PluginSettings;
    context: string;

    constructor(app: App, settings: PluginSettings, context: string) {
        this.app = app;
        this.settings = settings;
        this.context = context;
    }

    // 执行方法
    public async execute() {
		var commonUtils = new CommonHandler(this.app);
        var solar = Solar.fromDate(new Date());

		var fileName = "备忘录";
        var filePath = this.settings.memoPath + "/" + fileName + ".md"

        var dayTime = commonUtils.genTime(this.settings.dateFormat, solar);

        var locationRes = await commonUtils.genCity(this.settings.mapKey, this.settings.defaultCity,this.MAP_URL);
        var location = locationRes;
        var adcode = null;
        if (location instanceof Object) {
            // @ts-ignore
            location = locationRes.location;
            // @ts-ignore
            adcode = locationRes.adcode;
        }
        var weather = await commonUtils.genWeather(this.settings.mapKey, adcode, this.settings.defaultWeather,this.MAP_URL);

        var file = await commonUtils.checkAndCreateFile(filePath);
		debugger
        var title =await this.genTitle(this.context);
        var context =await this.genContext(this.context);
        //@ts-ignore
        var auditInfo = commonUtils.genAuditInfo(dayTime, location, weather, this.settings.styleType,context,title);

        await commonUtils.appendInfo(file, auditInfo)
    }


    private genContext(context:string): string {
        // 将文本按换行符分割成数组
        const lines = context.split('\n');
		
		// 去掉第一行
        lines.shift();

        // 为每一行添加前缀
        const prefixedLines = lines.map(line => `> ${line}`);

        // 将数组重新拼接为字符串
        return prefixedLines.join('\n');
    }

    private async genTitle(context:string) {
        // 将文本按换行符分割成数组
        const lines = context.split('\n');
		return lines[0];

    }

}
