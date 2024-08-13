import {App, Modal, TFile} from 'obsidian';
import {StyleType} from "./enum";
import {Moment} from "./moment";


export class EditorModal extends Modal {
	editor: unknown;
	moment: Moment;
	transfer:string;


	constructor(app: App, dateType: string, folderName: string, titleSize: number = 3, mapKey: string, defaultCity: string, defaultWeather: string, styleType: StyleType, transfer:string
	) {
		super(app)
		this.transfer = transfer;
		this.moment = new Moment(this.app, dateType, folderName, titleSize, mapKey, defaultCity, defaultWeather, styleType, '');
	}

	async onOpen() {
		// 打开对应文件
		await this.openFile(this.transfer);
		const editor = this.creatEditor(this.app);
		editor.set('moment');
		editor.load()
		editor.containerEl.setCssProps({
			width: '800px', height: '300px',
			background: '#ffffff',
			border: '2px solid #000000',
			padding: '20px',
			radius: '16px',
		})
		this.containerEl.append(editor.containerEl)
		this.modalEl.style.display = 'none'
		this.editor = editor;
	};

	async onClose() {
		// @ts-ignore
		var context = this.editor.editor.getValue()
		if (context !== 'moment' && context) {
			this.moment.context = context;
			await this.moment.execute();
			this.closeFile();
		}

	}

	private creatEditor(app: App) {
		// @ts-ignore
		const markdown = app.embedRegistry.embedByExtension.md({app, containerEl: createDiv()})
		debugger
		markdown.load();
		markdown.editable = !0;
		markdown.showEditor()
		const mEditor = Object.getPrototypeOf(Object.getPrototypeOf(markdown.editMode)).constructor
		markdown.unload()
		var editor = new mEditor(app, createDiv(), {
			app, scroll: 0, editMode: null,
			get editor() {
				return editor.editor
			},
			showSearch() {
			},
			toggleMode() {
			},
			onMarkdownScroll() {
			},
			getMode: () => 'source',
		})
		return editor
	}

	private async openFile(filePath: string) {
		// 获取文件对象
		const file = this.app.vault.getAbstractFileByPath(filePath);
		if (!file) {
			return;
		}
		// 打开文件
		const leaf = this.app.workspace.getLeaf(true);
		if (file instanceof TFile) {
			await leaf.openFile(file);
			this.app.workspace.setActiveLeaf(leaf, {focus: true});
		}
	}

	private async closeFile() {
		const activeLeaf = this.app.workspace.activeLeaf;
		if (activeLeaf) {
			activeLeaf.detach();
		}
	}
}
