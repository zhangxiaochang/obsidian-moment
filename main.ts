import {App, Plugin, PluginSettingTab, Setting, Notice, TFile, TFolder} from 'obsidian';
import {DateType, DateTypes, StyleType} from "./enum";
import {Moment} from "./moment";
import {requestUtils} from "./requestUtils";

interface Settings {
	dateFormat: DateType;
	folder: string;
	titleSize: number;
	mapKey: string
	defaultCity: string
	defaultWeather: string
	styleType: StyleType
}

const DEFAULT_SETTINGS: Settings = {
	dateFormat: DateType.Lunar,
	folder: "",
	titleSize: 3,
	mapKey: '',
	defaultCity: '河北 衡水',
	defaultWeather: '雨',
	styleType: StyleType.Simple
};

export default class moment extends Plugin {
	settings: Settings;

	async onload() {
		// 加载插件
		this.loadSettings();
		this.addSettingTab(new MomentSettingTab(this.app, this));
		// 增加命令
		this.addCommand({
			id: 'open-image-text-editor-modal',
			name: 'Open Image and Text Editor Modal',
			callback: async () => {
				new Moment(this.app,this.settings.dateFormat,this.settings.folder,this.settings.titleSize,this.settings.mapKey,this.settings.defaultCity,this.settings.defaultWeather).execute()
				// 实例化
				// var solar = Solar.fromDate(new Date());
				// var lunar = solar.getLunar();
				// var filename = lunar.getYearInChinese()+lunar.getYearInGanZhi()+lunar.getYearShengXiao()+"年";
				// var folder = "100 输入";
				// var fileByPath =  this.checkFileInFolderExists(filename+".md", folder);
				// var momth = lunar.getMonthInGanZhi()
				// if (!fileByPath){
				// 	this.app.vault.create(folder+"/"+filename+".md",momth)
				// }else{
				// 	const file = this.app.vault.getAbstractFileByPath(folder+"/"+filename+".md");
				// 	 this.app.vault.append(file,"testestest")
				// 	// 向文件内容追加新内容
				// }
				// fetchData('https://restapi.amap.com/v3/ip?key=5fa9f5cc69404e6a7299afac184fab7e');
				// fetchData('https://restapi.amap.com/v3/weather/weatherInfo?key=5fa9f5cc69404e6a7299afac184fab7e&city=110000&extensions=base');
				var res = await requestUtils.Get('https://restapi.amap.com/v3/ip?key=5fa9f5cc69404e6a7299afac184fab7e')
				debugger
			}
		});
	}

	onunload() {
		// 你插件的卸载逻辑...
	}


	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}


class MomentSettingTab extends PluginSettingTab {
	plugin: moment;

	constructor(app: App, plugin: moment) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();
		containerEl.createEl('h3', {text: 'Moment Settings'});

		new Setting(containerEl)
			.setName('Select Option')
			.setDesc('Choose an option from the enum')
			.addDropdown(dropdown =>
				dropdown
					.addOption(DateType.Lunar, DateTypes[DateType.Lunar].name)
					.addOption(DateType.Gregorian, DateTypes[DateType.Gregorian].name)
					.setValue(this.plugin.settings.dateFormat)
					.onChange(async (value) => {
						this.plugin.settings.dateFormat = value as DateType;
						await this.plugin.saveSettings();
					}))

		new Setting(containerEl)
			.setName('Folder Path')
			.setDesc('Specify the folder path')
			.addText(text => text
				.setPlaceholder('Enter folder path')
				.setValue(this.plugin.settings.folder)
				.onChange(async (value) => {
					this.plugin.settings.folder = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('month Size')
			.setDesc('Specify the month Size')
			.addText(text => text
				.setPlaceholder('Enter month Size')
				.setValue(String(this.plugin.settings.titleSize))
				.onChange(async (value) => {
					this.plugin.settings.titleSize = Number(value);
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('map key')
			.setDesc('Specify the map key')
			.addText(text => text
				.setPlaceholder('Enter map key')
				.setValue(String(this.plugin.settings.mapKey))
				.onChange(async (value) => {
					this.plugin.settings.mapKey = value;
					await this.plugin.saveSettings();
				}));
		new Setting(containerEl)
			.setName('default city')
			.setDesc('Specify the default city')
			.addText(text => text
				.setPlaceholder('Enter default city')
				.setValue(String(this.plugin.settings.defaultCity))
				.onChange(async (value) => {
					this.plugin.settings.defaultCity = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('default weather')
			.setDesc('Specify the default weather')
			.addText(text => text
				.setPlaceholder('Enter default weather')
				.setValue(String(this.plugin.settings.defaultWeather))
				.onChange(async (value) => {
					this.plugin.settings.defaultWeather = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('style type')
			.setDesc('Choose an type from the enum')
			.addDropdown(dropdown =>
				dropdown
					.addOption(StyleType.Simple, "默认")
					.setValue(this.plugin.settings.styleType)
					.onChange(async (value) => {
						this.plugin.settings.styleType = value as StyleType;
						await this.plugin.saveSettings();
					}))
	}
}

