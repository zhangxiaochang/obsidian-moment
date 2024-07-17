import {App, Plugin, PluginSettingTab, Setting, Notice, TFile, TFolder} from 'obsidian';
import {Solar} from 'lunar-typescript';
import {DateType} from "./enum";


export class Moment {
	app: App;

	constructor(app: App) {
		this.app = app;
	}

	// 执行方法
	public async execute(dateFormat: string, folderName: string, titleSize: number = 3) {
		var solar = Solar.fromDate(new Date());
		// 1-0 获取文件名 判断是否存在 创建or获取  文件名称格式 提供枚举 做setting参数
		var fileName = this.genfileName(dateFormat,solar);
		var filePath = folderName + "/" + fileName + ".md"
		var file = await this.checkAndCreateFile(filePath);

		// 1-1 获取月份 判断是否存在3级标题 写入or跳过 时间一般是向前的

		// 1-2 获取日期时间

		// 2-0 获取省份城市 对于省份和城市相同的 进行处理（中国 北京） 缺省值 河北 衡水市   高德key做setting参数 缺省值做setting参数
		// 2-1 获取天气 缺省值 雨 缺省值做setting参数

		// 3-0 组装审计信息 时间 天气 地点 写入文件 审计信息格式提供枚举 做setting参数   是否可以对其做个css样式？

		// 4-0 打开文件最下面的光标处 进行写作
	}

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

	private genfileName(dateFormat: string,solar:Solar): string {
		var lunar = solar.getLunar();
		switch (dateFormat) {
			case DateType.Lunar:
				return lunar.getYearInChinese() + lunar.getYearInGanZhi() + lunar.getYearShengXiao() + "年";
			case DateType.Gregorian:
				return lunar.getYearInChinese();
			default:
				return lunar.getYearInChinese() + lunar.getYearInGanZhi() + lunar.getYearShengXiao() + "年";
		}
	}


	private genMonth(file: File,solar:Solar): string {
		var lunar = solar.getLunar();
		lunar.getCurrentJieQi()
		switch (dateFormat) {
			case DateType.Lunar:
				return lunar.getYearInChinese() + lunar.getYearInGanZhi() + lunar.getYearShengXiao() + "年";
			case DateType.Gregorian:
				return lunar.getYearInChinese();
			default:
				return lunar.getYearInChinese() + lunar.getYearInGanZhi() + lunar.getYearShengXiao() + "年";
		}
	}


}
