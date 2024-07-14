import {App} from 'obsidian';
import {InstanceModelPopUp} from "./instanceViewPopUp";

export class Moment {
	app: App;

	constructor(app: App) {
		this.app = app;
	}


	async execute() {
		//1 弹窗获取日期
		const rearrangeDue = await this.rearrangeDueObtain();
	}

	async rearrangeDueObtain(): Promise<String> {
		return new Promise<String>((resolve) => {
			new InstanceModelPopUp(this.app, (result) => {
				resolve(result);
			}).open();
		});
	}

}
