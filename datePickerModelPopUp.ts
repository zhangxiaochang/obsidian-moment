import { App, Modal, Setting } from "obsidian";

export class DatePickerModelPopUp extends Modal {
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
		datePicker.style.margin = '4px';
		contentEl.style.textAlign = "center"
		new Setting(contentEl)
			.addButton((btn) =>
				btn
					.setButtonText("Submit")
					.setCta()
					.onClick(() => {
						this.close();
						this.onSubmit(datePicker.value);
					}));

		datePicker.focus();

		return datePicker.value;
	}


	onClose() {
		let { contentEl } = this;
		contentEl.empty();
	}
}
