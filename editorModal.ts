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
		editor.load();
		// 动态计算尺寸
		const calcSize = () => {
			const workspaceRect = this.app.workspace.containerEl.getBoundingClientRect();
			return {
				width: workspaceRect.width * 0.6,
				height: workspaceRect.height * 0.4,
			};
		};

		const { width, height } = calcSize();
		// 修复版样式设置
		editor.containerEl.setCssProps({
			width: `${width}px`,
			height: `${height}px`,
			background: '#ffffff',
			border: '2px solid #e0e0e0',
			borderRadius: '24px',
			'-webkit-border-radius': '24px', // 兼容旧版WebKit
			padding: '32px',
			boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
			backgroundClip: 'padding-box', // 关键修复
			borderStyle: 'solid', // 明确指定
			display: 'block' // 确保元素是块级
		});

		// 鼠标悬停效果 - 强化圆角视觉反馈
		editor.containerEl.addEventListener('mouseenter', () => {
			editor.containerEl.setCssProps({
				boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
				borderColor: '#d0d0d0',
				// 悬停时轻微放大圆角创造"膨胀"效果
				borderRadius: '28px',
				transform: 'scale(1.03)', // 轻微放大增加互动感
				background: '#ffffff' // 鼠标悬停时修改背景颜色
			});
		});

		editor.containerEl.addEventListener('mouseleave', () => {
			editor.containerEl.setCssProps({
				boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
				borderColor: '#e0e0e0',
				borderRadius: '24px',
				transform: 'scale(1)',
				background: '#f5f5f5' // 鼠标离开时恢复原始背景颜色
			});
		});

		this.containerEl.append(editor.containerEl);
		this.modalEl.style.display = 'none';
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
