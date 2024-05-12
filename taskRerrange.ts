import {App, Editor, MarkdownView, TFile} from 'obsidian';
import {DatePickerModelPopUp} from "./datePickerModelPopUp";

export class TaskRerrange {
	app: App;
	editor: Editor;
	markDownView: MarkdownView;
	file: TFile | null;

	constructor(app: App, editor: Editor, markDownView: MarkdownView) {
		this.app = app;
		this.editor = editor;
		this.markDownView = markDownView;
		this.file = markDownView.file;
	}

	async execute() {
		//1 弹窗获取日期
		const rearrangeDue = await this.rearrangeDueObtain();
		//2 组装新文件名
		// @ts-ignore
		const newPath = this.newPathObtian(rearrangeDue);
		//3 修改文件名、完成日期
		this.rearrangeTask(rearrangeDue, newPath['newPath'], newPath['oldDue']);
	}

	async rearrangeDueObtain(): Promise<String> {
		return new Promise<String>((resolve) => {
			new DatePickerModelPopUp(this.app, (result) => {
				resolve(result);
			}).open();
		});
	}


	newPathObtian(rearrangeDue: String): { oldDue: String; newPath: String } {
		let oldPath = this.file?.path;
		let fileInfo = this.splitPath2FolderAndFileName(oldPath)
		let newFileInfo = this.newFileNameAssemble(new String(fileInfo['fileName']), rearrangeDue);
		let newPath = String(fileInfo['folder'] + String(newFileInfo['newFileName']));
		return {oldDue: new String(newFileInfo['oldDue']), newPath};
	}

	rearrangeTask(rearrangeDue: String, newPath: String, oldDue: String) {
		this.editor.setLine(1, "due:: " + rearrangeDue);
		// @ts-ignore
		this.app.vault.rename(this.file, newPath)
		this.markDownView.save()
	}

	private splitPath2FolderAndFileName(path: string | undefined) {
		// 使用正则表达式匹配最后一个斜杠之前的所有内容
		const lastSlashIndex = path?.lastIndexOf('/');
		if (lastSlashIndex !== -1) {
			// @ts-ignore
			const folder = path?.substring(0, lastSlashIndex + 1);
			// @ts-ignore
			const fileName = path?.substring(lastSlashIndex + 1);
			return {folder, fileName}
		} else {
			return {path}
		}
	}

	private newFileNameAssemble(fileName: String, due: String) {
		const regex = /\d{4}-\d{2}\d{2}/; // 匹配日期前的字符，包括最后一个'-'和日期
		const match = fileName.match(regex);
		const newDateType = due.replace(/-([0-9]{2})-([0-9]{2})$/, '-$1$2');

		if (match) {
			const prefix = fileName.slice(0, -match[0].length-3); // 从原始文本中移除匹配的日期和'-'字符
			return {newFileName: prefix + newDateType + '.md', oldDue: match[0]};
		} else {
			return {fileName};
		}
	}

}
