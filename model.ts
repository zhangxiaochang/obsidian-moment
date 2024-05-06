import { App, Modal, Setting } from "obsidian";

export class ExampleModal extends Modal {
	result: string;
	onSubmit: (result: string) => void;

	constructor(app: App, onSubmit: (result: string) => void) {
		super(app);
		this.onSubmit = onSubmit;
	}

	onOpen() {
		const {contentEl} = this;
		const h1 = contentEl.createEl("h1", { text: "What's your name?" });
		h1.style.textAlign = "left"
		const datePicker = contentEl.createEl('input');

		// 设置输入框的类型为日期
		datePicker.type = 'date';
		datePicker.style.margin = '4px'; // 设置背景颜色为浅蓝色
		contentEl.style.textAlign = "center"
		new Setting(contentEl)
			.addButton((btn) =>
				btn
					.setButtonText("Submit")
					.setCta()
					.onClick(() => {
						this.result=datePicker.value
						this.close();
						this.onSubmit(this.result);
					}));

		datePicker.focus();

	}


	onClose() {
		let { contentEl } = this;
		contentEl.empty();
		debugger
	}
}
