import { App, Plugin, PluginSettingTab, Setting, Notice, TFile, TFolder } from 'obsidian';
import {Solar} from 'lunar-typescript';
export default class MyPlugin extends Plugin {
	async onload() {
		this.addCommand({
			id: 'open-image-text-editor-modal',
			name: 'Open Image and Text Editor Modal',
			callback: () => {
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


	//  checkFileInFolderExists(fileName, folderPath) {
	// 	// Get the Vault instance
	// 	const vault = this.app.vault;
	//
	// 	// Get the folder
	// 	const folder = vault.getAbstractFileByPath(folderPath);
	//
	// 	// Check if the folder exists and is a folder
	// 	if (!folder || !(folder instanceof TFolder)) {
	// 		new Notice(`The folder "${folderPath}" does not exist.`);
	// 		return false;
	// 	}
	//
	// 	// Get all files in the folder
	// 	const files = folder.children.filter(file => file instanceof TFile);
	//
	// 	// Check if the file exists in the folder
	// 	const fileExists = files.some(file => file.name === fileName);
	// 	// Show a notice with the result
	// 	if (fileExists) {
	// 		return true;
	// 	} else {
	// 		return false;
	// 	}
	// }
}


