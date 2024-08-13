import {App, Plugin, PluginSettingTab, Setting} from 'obsidian';
import {DateType, DateTypes, StyleType} from "./enum";
import {Moment} from "./moment";
import {EditorModal} from "./editorModal";

interface Settings {
	dateFormat: DateType;
	folder: string;
	titleSize: number;
	mapKey: string
	defaultCity: string
	defaultWeather: string
	styleType: StyleType
	transfer:string
}

const DEFAULT_SETTINGS: Settings = {
	dateFormat: DateType.Lunar,
	folder: "",
	titleSize: 3,
	mapKey: '',
	defaultCity: '河北 衡水',
	defaultWeather: '雨',
	styleType: StyleType.Simple,
	transfer:''
};

export default class moment extends Plugin {
	settings: Settings;

	async onload() {
		// 加载插件
		this.loadSettings();
		this.addSettingTab(new MomentSettingTab(this.app, this));
		// 增加命令
		this.addCommand({
			id: 'moment',
			name: 'moment',
			callback: async () => {
				new EditorModal(this.app, this.settings.dateFormat, this.settings.folder, this.settings.titleSize, this.settings.mapKey, this.settings.defaultCity, this.settings.defaultWeather, this.settings.styleType,this.settings.transfer).open()
			}
		});
	}

	onunload() {

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
			.setName('transfer')
			.setDesc('Specify the transfer files')
			.addText(text => text
				.setPlaceholder('Enter transfer')
				.setValue(String(this.plugin.settings.transfer))
				.onChange(async (value) => {
					this.plugin.settings.transfer = value;
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

