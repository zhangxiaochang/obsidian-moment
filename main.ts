import {App, Plugin, PluginSettingTab, Setting, Notice, TFile, TFolder} from 'obsidian';
import {DateType, DateTypes} from "./enum";
import {Moment} from "./moment";

interface Settings {
	dateFormat: DateType;
	folder: string;
	titleSize: number;
}

const DEFAULT_SETTINGS: Settings = {
	dateFormat: DateType.Lunar,
	folder: "",
	titleSize: 3
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
			callback: () => {
				new Moment(this.app).execute(this.settings.dateFormat,this.settings.folder)
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
				.setPlaceholder('Enter folder path')
				.setValue(String(this.plugin.settings.titleSize))
				.onChange(async (value) => {
					this.plugin.settings.titleSize = Number(value);
					await this.plugin.saveSettings();
				}));
	}
}

