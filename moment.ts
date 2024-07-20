import {App, TAbstractFile, TFile} from 'obsidian';
import {Solar} from 'lunar-typescript';
import {DateType, StyleType} from "./enum";
import {requestUtils} from "./requestUtils";


export class Moment {

	MAP_URL: string = 'https://restapi.amap.com/v3/';
	app: App;
	dateType: string; // 日期类型
	folderName: string; // 文件夹位置
	titleSize: number // 标题大小
	mapKey: string // 高德地图key
	defaultCity: string // 默认城市
	defaultWeather: string // 默认天气
	styleType: StyleType // 样式 目前只有一种

	constructor(app: App, dateType: string, folderName: string, titleSize: number = 3, mapKey: string, defaultCity: string, defaultWeather: string, styleType: StyleType // 样式 目前只有一种
	) {
		this.app = app;
		this.dateType = dateType;
		this.folderName = folderName;
		this.titleSize = titleSize;
		this.mapKey = mapKey;
		this.defaultCity = defaultCity;
		this.defaultWeather = defaultWeather;
		this.styleType = styleType;
	}

	// 执行方法
	public async execute() {
		var solar = Solar.fromDate(new Date());
		// 1-0 获取文件名 判断是否存在 创建or获取  文件名称格式 提供枚举 做setting参数
		var fileName = this.genfileName(this.dateType, solar);
		var filePath = this.folderName + "/" + fileName + ".md"

		// 1-1 获取月份
		var titleName = this.genMonth(this.dateType, solar);

		// 1-2 获取日期时间
		var dayTime = this.genTime(this.dateType, solar);

		// 2-0 获取省份城市 对于省份和城市相同的 进行处理（中国 北京） 缺省值 河北 衡水市   高德key做setting参数 缺省值做setting参数
		var locationRes = await this.genCity(this.mapKey, this.defaultCity);
		var location = locationRes;
		var adcode = null;
		// 2-1 获取天气 缺省值 雨 缺省值做setting参数
		if (location instanceof Object) {
			// @ts-ignore
			location = locationRes.location;
			// @ts-ignore
			adcode = locationRes.adcode;
		}
		var weather = await this.genWeather(this.mapKey, adcode, this.defaultWeather);
		// 3-0 获取文件
		var file = await this.checkAndCreateFile(filePath);
		// 3-1 组装内容
		var auditInfo = this.genAuditInfo(dayTime, location, weather, this.styleType);
		var title =await this.genTitle(file, titleName, this.titleSize);
		// 3-2 写入文件
		await this.appendInfo(file, title)
		await this.appendInfo(file, auditInfo)
		// 4-0 打开文件
		const leaf = this.app.workspace.getLeaf(true);
		await leaf.openFile(file, {active: true});
		this.app.workspace.setActiveLeaf(leaf);
	}

	// 检查一个文件是否存在  存在直接返回 反之创建文件
	// 入参：文件路径（相对路径）
	// 出参：文件（新文件/旧文件）
	private async checkAndCreateFile(filePath: string) {

		let file = this.app.vault.getAbstractFileByPath(filePath);
		if (!file) {
			// 文件不存在，创建文件
			file = await this.app.vault.create(filePath, '');  // 空字符串表示创建一个空文件
		}
		return file;
	}

	private genfileName(dateType: string, solar: Solar): string {
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


	private genMonth(dateType: string, solar: Solar): string {
		debugger
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

	private genTime(dateType: string, solar: Solar): string {
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

	private async genCity(mapKey: string, defaultCity: string) {
		if (mapKey === null) {
			return defaultCity;
		}
		var cityResponse = await requestUtils.Get(this.MAP_URL + "ip?key=" + mapKey);
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

	private async genWeather(mapKey: string, adcode: string, defaultWeather: string) {
		if (mapKey === null) {
			return defaultWeather;
		}
		var cityResponse = await requestUtils.Get(this.MAP_URL + "weather/weatherInfo?key=" + mapKey + "&city=" + adcode + "&extensions=base");
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

	private genAuditInfo(dayTime: string, location: string, weather: string, styleType: StyleType) {
		var auditInfo = dayTime + " " + location + " " + weather;
		switch (styleType) {
			case StyleType.Simple:
				var auditInfoCSS = `<span class="right-bottom-corner">${auditInfo}</span>`
				return '\n' + "> [!moment]" + '\n' + ">" + '\n' + ">" + auditInfoCSS;
			default:
				var auditInfoCSS = `<span class="right-bottom-corner">${auditInfo}</span>`
				return '\n' + "> [!moment]" + '\n' + ">" + '\n' + ">" + auditInfoCSS;
		}
	}

	private async genTitle(file: TAbstractFile, titleName: string, titleSize: number) {
		if (file instanceof TFile) {
			const fileContent = await this.app.vault.read(file);
			const titlePrefix = '#'.repeat(titleSize);
			const regex = new RegExp(`${titlePrefix} ${titleName}`, 'g');
			var isExist = regex.test(fileContent);
			if (!isExist) {
				if (fileContent == ''){
					return `${titlePrefix} ${titleName}`;
				}
				return '\n' + `${titlePrefix} ${titleName}`;
			}
		}

		return "";

	}

	private async appendInfo(file: TAbstractFile, appendInfo: string) {
		if (file instanceof TFile) {
			const fileContent = await this.app.vault.read(file);
			const appendContent = fileContent + appendInfo;
			await this.app.vault.modify(file, appendContent);
		}

	}

}
