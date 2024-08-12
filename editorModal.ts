import {App, Modal} from 'obsidian';
import {StyleType} from "./enum";
import {Moment} from "./moment";


export class EditorModal extends Modal {
	editor :unknown;
	moment: Moment;
	constructor(app: App, dateType: string, folderName: string, titleSize: number = 3, mapKey: string, defaultCity: string, defaultWeather: string, styleType: StyleType // 样式 目前只有一种
	) {
		super(app)
		this.moment = new Moment(this.app, dateType, folderName, titleSize, mapKey, defaultCity, defaultWeather, styleType, '');
	}
	onOpen() {
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
	async onClose(){
		// @ts-ignore
		var context = this.editor.editor.getValue()
		if (context !== 'moment' && context){
			this.moment.context = context;
			this.moment.execute();
		}

	}
	private creatEditor(app:App) {
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
}
