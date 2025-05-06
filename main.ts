import {App, Plugin, PluginSettingTab, Setting} from 'obsidian';
import { DateType, DateTypes, StyleType } from "./enum";
import { Moment } from "./moment";
import { EditorModal } from "./editorModal";
import { PluginSettings } from "./settings";

export default class moment extends Plugin {
    settings: PluginSettings;

    async onload() {
        // 加载插件
        await this.loadSettings();
        this.addSettingTab(new MomentSettingTab(this.app, this));
        // 增加命令
        this.addCommand({
            id: 'moment',
            name: 'moment',
            callback: async () => {
                this.settings.styleType = StyleType.Simple;
                new EditorModal(
                    this.app,
                    this.settings // 直接传入 settings 实例
                ).open();
            }
        });

        this.addCommand({
            id: 'memo',
            name: 'memo',
            callback: async () => {
                this.settings.styleType = StyleType.Memo;
                new EditorModal(
                    this.app,
                    this.settings // 直接传入 settings 实例
                ).open();
            }
        });
    }

    onunload() {

    }

    async loadSettings() {
        const loadedData = await this.loadData();
        this.settings = PluginSettings.getDefaultSettings();
        if (loadedData) {
            this.settings.updateSettings(loadedData);
        }
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
                    .addOption(this.plugin.settings.dateFormat, DateTypes[this.plugin.settings.dateFormat].name)
                    .onChange(async (value) => {
                        this.plugin.settings.dateFormat = value as DateType;
                        await this.plugin.saveSettings();
                    })
            );

        new Setting(containerEl)
            .setName('moment Path')
            .setDesc('Specify the folder path')
            .addText(text => text
                .setPlaceholder('Enter folder path')
                .setValue(this.plugin.settings.momentPath)
                .onChange(async (value) => {
                    this.plugin.settings.momentPath = value;
                    await this.plugin.saveSettings();
                })
            );

        new Setting(containerEl)
            .setName('memo Path')
            .setDesc('Specify the folder path')
            .addText(text => text
                .setPlaceholder('Enter folder path')
                .setValue(this.plugin.settings.memoPath)
                .onChange(async (value) => {
                    this.plugin.settings.memoPath = value;
                    await this.plugin.saveSettings();
                })
            );

        new Setting(containerEl)
            .setName('month Size')
            .setDesc('Specify the month Size')
            .addText(text => text
                .setPlaceholder('Enter month Size')
                .setValue(String(this.plugin.settings.titleSize))
                .onChange(async (value) => {
                    this.plugin.settings.titleSize = Number(value);
                    await this.plugin.saveSettings();
                })
            );

        new Setting(containerEl)
            .setName('map key')
            .setDesc('Specify the map key')
            .addText(text => text
                .setPlaceholder('Enter map key')
                .setValue(this.plugin.settings.mapKey)
                .onChange(async (value) => {
                    this.plugin.settings.mapKey = value;
                    await this.plugin.saveSettings();
                })
            );

        new Setting(containerEl)
            .setName('transfer')
            .setDesc('Specify the transfer files')
            .addText(text => text
                .setPlaceholder('Enter transfer')
                .setValue(this.plugin.settings.transfer)
                .onChange(async (value) => {
                    this.plugin.settings.transfer = value;
                    await this.plugin.saveSettings();
                })
            );
		new Setting(containerEl)
			.setName('memo transfer')
			.setDesc('Specify the memo transfer files')
			.addText(text => text
				.setPlaceholder('Enter memo transfer')
				.setValue(this.plugin.settings.memoTransfer)
				.onChange(async (value) => {
					this.plugin.settings.memoTransfer = value;
					await this.plugin.saveSettings();
				})
			);

        new Setting(containerEl)
            .setName('default city')
            .setDesc('Specify the default city')
            .addText(text => text
                .setPlaceholder('Enter default city')
                .setValue(this.plugin.settings.defaultCity)
                .onChange(async (value) => {
                    this.plugin.settings.defaultCity = value;
                    await this.plugin.saveSettings();
                })
            );

        new Setting(containerEl)
            .setName('default weather')
            .setDesc('Specify the default weather')
            .addText(text => text
                .setPlaceholder('Enter default weather')
                .setValue(this.plugin.settings.defaultWeather)
                .onChange(async (value) => {
                    this.plugin.settings.defaultWeather = value;
                    await this.plugin.saveSettings();
                })
            );
    }
}

