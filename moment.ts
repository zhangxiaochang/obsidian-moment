import {App, Plugin, PluginSettingTab, Setting, Notice, TFile, TFolder, TAbstractFile} from 'obsidian';
import {Solar} from 'lunar-typescript';
import {DateType} from "./enum";
import {requestUtils} from "./requestUtils";


export class Moment {

	MAP_URL: string = 'https://restapi.amap.com/v3/';
	app: App;
	dateType: string; // 日期类型
	folderName: string; // 文件夹位置
	titleSize: number // 标题大小
	mapKey: string // 高德地图key
	defaultCity: string // 默认城市

	constructor(app: App, dateType: string, folderName: string, titleSize: number = 3,mapKey:string,defaultCity: string ) {
		this.app = app;
		this.dateType = dateType; 
		this.folderName = folderName;
		this.titleSize = titleSize;
		this.mapKey = mapKey;
		this.defaultCity = defaultCity;
	}

	// 执行方法
	public async execute() {
		debugger
		var solar = Solar.fromDate(new Date());
		// 1-0 获取文件名 判断是否存在 创建or获取  文件名称格式 提供枚举 做setting参数
		var fileName = this.genfileName(this.dateType, solar);
		var filePath = this.folderName + "/" + fileName + ".md"

		// 1-1 获取月份
		var titleName = this.genMonth(this.dateType, solar);

		// 1-2 获取日期时间
		var dayTime = this.genTime(this.dateType, solar);

		// 2-0 获取省份城市 对于省份和城市相同的 进行处理（中国 北京） 缺省值 河北 衡水市   高德key做setting参数 缺省值做setting参数
		var city = await this.genCity(this.mapKey,this.defaultCity);
		// 2-1 获取天气 缺省值 雨 缺省值做setting参数

		// 3-0 组装审计信息 时间 天气 地点 写入文件 审计信息格式提供枚举 做setting参数   是否可以对其做个css样式？

		// 4-0 操作文件
		// var file = await this.checkAndCreateFile(filePath);
		// this.appendMonth(this.dateType,file,solar,this.titleSize)


	}

	// 检查一个文件是否存在  存在直接返回 反之创建文件
	// 入参：文件路径（相对路径）
	// 出参：文件（新文件/旧文件）
	private async checkAndCreateFile(filePath: string) {

		let file = this.app.vault.getAbstractFileByPath(filePath);
		if (file) {
			new Notice('File exists');
		} else {
			// 文件不存在，创建文件
			file = await this.app.vault.create(filePath, '');  // 空字符串表示创建一个空文件
			new Notice('File did not exist and has been created');
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
				return lunar.getMonthInChinese()+"月"+lunar.getDayInChinese()+"  "+solar.getHour()+":"+solar.getMinute();
			case DateType.Gregorian:
				return lunar.getMonth()+"月"+lunar.getDay()+" "+lunar.getTime();;
			default:
				return lunar.getMonthInChinese()+"月"+lunar.getDayInChinese()+"  "+solar.getHour()+":"+solar.getMinute();
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
			var province = cityInfo.province;
			var city = "";
			if (String(cityInfo.city).endsWith("市")) {
				city =  String(cityInfo.city).slice(0, -"市".length);
			}
			if (province === String(cityInfo.city)) {
				return "中国 " + city;
			}
			return province + city;
		}
		return defaultCity;

	}


	private async appendMonth(dateType: string, file:TAbstractFile, solar:Solar, titleSize: number): Promise<boolean> {
		var titleName = this.genMonth(dateType, solar);
		if (file instanceof TFile) {
			const fileContent = await this.app.vault.read(file);
			const titlePrefix = '#'.repeat(titleSize);
			const regex = new RegExp(`${titlePrefix} ${titleName}`, 'g');
			var b = regex.test(fileContent);
			return regex.test(fileContent);
			return true;
		}

		return false;
	}

}
