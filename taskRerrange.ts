import {App, Editor, MarkdownView, TFile} from 'obsidian';
import {datePickerModelPopUp} from "./datePickerModelPopUp";

export class taskRerrange {
	app: App;
	editor: Editor;
	markDownView: MarkdownView;

	constructor(app: App, editor: Editor, markDownView: MarkdownView) {
		this.app = app;
		this.editor = editor;
		this.markDownView = markDownView;
	}

	async execute() {
		//0 获取文件
		const {file} = this.markDownView;
		//1 弹窗获取日期
		const rearrangeDue = await this.rearrangeDueObtain();
		//2 组装新文件名
		// @ts-ignore
		const newPath = this.newPathObtian(file, rearrangeDue);
		//3 修改文件名、完成日期
		this.rearrangeTask(rearrangeDue);
	}

	async rearrangeDueObtain(): Promise<String> {
		return new Promise<String>((resolve) => {
			new datePickerModelPopUp(this.app, (result) => {
				resolve(result);
			}).open();
		});
	}


	newPathObtian(file: TFile, rearrangeDue: String): String {
		let oldPath = file.path;
		return "xxx.md"
	}

	rearrangeTask(rearrangeDue: String) {

	}


}