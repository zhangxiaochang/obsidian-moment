import { App, TAbstractFile, TFile } from 'obsidian';
import { Solar } from 'lunar-typescript';
import { DateType, StyleType } from "./enum";
import { requestUtils } from "./requestUtils";


export class CommonHandler {

	app: App;
	constructor(app: App) {
		this.app = app;
	}

	// 检查一个文件是否存在  存在直接返回 反之创建文件
	// 入参：文件路径（相对路径）
	// 出参：文件（新文件/旧文件）
	public async checkAndCreateFile(filePath: string) {

		let file = this.app.vault.getAbstractFileByPath(filePath);
		if (!file) {
			// 文件不存在，创建文件
			file = await this.app.vault.create(filePath, '');  // 空字符串表示创建一个空文件
		}
		return file;
	}

	public genfileName(dateType: string, solar: Solar): string {
		var lunar = solar.getLunar();
		switch (dateType) {
			case DateType.Lunar:
				return lunar.getYearInChinese() + lunar.getYearInGanZhi() + lunar.getYearShengXiao() + "年";
			case DateType.Gregorian:
				return lunar.getYearInChinese();
			default:
				return lunar.getYearInChinese() + lunar.getYearInGanZhi() + lunar.getYearShengXiao() + "年";
		}
	}


	public genMonth(dateType: string, solar: Solar): string {
		var lunar = solar.getLunar();
		switch (dateType) {
			case DateType.Lunar:
				var month = lunar.getCurrentJieQi() == null ? lunar.getPrevJieQi()?.getName() : lunar.getCurrentJieQi()?.getName();
				return <string>month;
			case DateType.Gregorian:
				return lunar.getMonthInChinese();
			default:
				var month = lunar.getCurrentJieQi() == null ? lunar.getPrevJieQi()?.getName() : lunar.getCurrentJieQi()?.getName();
				return <string>month;
		}
	}

	public genContext(context: string): string {
		// 将文本按换行符分割成数组
		const lines = context.split('\n');

		// 为每一行添加前缀
		const prefixedLines = lines.map(line => `> ${line}`);

		// 将数组重新拼接为字符串
		return prefixedLines.join('\n');
	}

	public genTime(dateType: string, solar: Solar): string {
		debugger
		var lunar = solar.getLunar();
		switch (dateType) {
			case DateType.Lunar:
				return lunar.getMonthInChinese() + "月" + lunar.getDayInChinese() + "  " + solar.getHour().toString().padStart(2, '0') + ":" + solar.getMinute().toString().padStart(2, '0');
			case DateType.Gregorian:
				return lunar.getMonth() + "月" + lunar.getDay() + " " + lunar.getTime();
				;
			default:
				return lunar.getMonthInChinese() + "月" + lunar.getDayInChinese() + "  " + solar.getHour() + ":" + solar.getMinute();
		}
	}

	public async genCity(mapKey: string, defaultCity: string, url: string) {
		if (mapKey === null) {
			return defaultCity;
		}
		var cityResponse = await requestUtils.Get(url + "ip?key=" + mapKey);
		var status = cityResponse.status;
		if (status === 1) {
			var cityInfo = cityResponse.data;
			// @ts-ignore
			if (cityInfo.status === '1') {
				// @ts-ignore
				var province = cityInfo.province;
				// @ts-ignore
				var adcode = cityInfo.adcode;
				// @ts-ignore
				var city = cityInfo.city;
				var location = "";
				if (province === city) {
					location = "中国" + city;
				}
				if (location.endsWith("市")) {
					location = location.slice(0, -"市".length);
				}
				return {
					location, adcode
				}
			}
		}
		return defaultCity;

	}

	public async genWeather(mapKey: string, adcode: string, defaultWeather: string, url: string) {
		if (mapKey === null) {
			return defaultWeather;
		}
		var cityResponse = await requestUtils.Get(url + "weather/weatherInfo?key=" + mapKey + "&city=" + adcode + "&extensions=base");
		var status = cityResponse.status;
		if (status === 1) {
			var weatherInfo = cityResponse.data;
			// @ts-ignore
			if (weatherInfo.status === '1') {
				// @ts-ignore
				return (weatherInfo.lives)[0].weather;
			}
		}
		return defaultWeather;
	}

	public genAuditInfo(dayTime: string, location: string, weather: string, styleType: StyleType, context: string, title: string) {
		switch (styleType) {
			case StyleType.Simple:
				var auditInfo = dayTime + " " + location + " " + weather;
				var auditInfoCSS = `<span class="right-bottom-corner">${auditInfo}</span>`
				return '\n' + '\n' + "> [!moment]" + '\n' + context + '\n' + ">" + auditInfoCSS;
			case StyleType.Memo:
				return '\n' + '\n' + "1. > [!memo] " + title + " | " + dayTime + '\n' + context;
		}
	}

	public async genTitle(file: TAbstractFile, titleName: string, titleSize: number) {
		if (file instanceof TFile) {
			const fileContent = await this.app.vault.read(file);
			const titlePrefix = '#'.repeat(titleSize);
			const regex = new RegExp(`${titlePrefix} ${titleName}`, 'g');
			var isExist = regex.test(fileContent);
			if (!isExist) {
				if (fileContent == '') {
					return `${titlePrefix} ${titleName}`;
				}
				return '\n' + `${titlePrefix} ${titleName}`;
			}
		}

		return "";

	}

	public async appendInfo(file: TAbstractFile, appendInfo: string) {
		if (file instanceof TFile) {
			const fileContent = await this.app.vault.read(file);
			const appendContent = fileContent + appendInfo;
			await this.app.vault.modify(file, appendContent);
		}

	}

}
