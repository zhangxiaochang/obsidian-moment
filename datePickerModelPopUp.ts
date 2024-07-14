import { App, Modal, Notice ,Editor} from 'obsidian';
import * as CodeMirror from 'codemirror';


export class ImageTextEditorModal extends Modal {
	private editor: CodeMirror.Editor;

	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;

		// 设置弹窗标题
		contentEl.createEl('h2', { text: 'Image and Text Editor' });

		// 创建编辑器容器
		const editorContainer = contentEl.createDiv({ cls: 'editor-container' });

		// 创建一个 textarea 元素作为 CodeMirror 的输入源
		const textArea = editorContainer.createEl('textarea');

		// 初始化 CodeMirror 编辑器
		this.editor = CodeMirror.fromTextArea(textArea, {
			mode: 'markdown',
			lineNumbers: true,
			lineWrapping: true,
			theme: 'default', // 你可以选择其他 CodeMirror 主题
		});

		// 监听粘贴事件
		this.editor.on('paste', async (cm: CodeMirror.Editor, event: ClipboardEvent) => {
			const files = event.clipboardData?.files;
			if (files && files.length > 0) {
				const file = files[0];
				if (file.type.startsWith('image/')) {
					event.preventDefault();
					await this.handleImagePaste(file);
				}
			}
		});

		// 创建保存按钮
		const saveButton = contentEl.createEl('button', { text: 'Save' });
		saveButton.addEventListener('click', async () => {
			const content = this.editor.getValue();
			await this.saveContent(content);
			this.close();
		});

		// 创建关闭按钮
		const closeButton = contentEl.createEl('button', { text: 'Close' });
		closeButton.addEventListener('click', () => {
			this.close();
		});
	}

	async handleImagePaste(file: File) {
		const arrayBuffer = await file.arrayBuffer();
		const fileName = `Pasted Image ${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
		const directoryPath = 'Pasted Images';
		const imagePath = `${directoryPath}/${fileName}`;

		try {
			// 检查并创建目录
			await this.ensureDirectoryExists(directoryPath);

			// 创建二进制文件
			await this.app.vault.createBinary(imagePath, arrayBuffer);

			const markdownLink = `![[${imagePath}]]`;

			// 插入图片链接到编辑器内容中
			const doc = this.editor.getDoc();
			const cursor = doc.getCursor();
			doc.replaceRange(markdownLink, cursor);

			new Notice('Image pasted and saved successfully.');
		} catch (error) {
			new Notice('Failed to save pasted image.');
			console.error(error);
		}
	}

	async ensureDirectoryExists(directoryPath: string) {
		const normalizedPath = normalizePath(directoryPath);
		const abstractFile = this.app.vault.getAbstractFileByPath(normalizedPath);

		if (!abstractFile) {
			await this.app.vault.createFolder(normalizedPath);
		}
	}

	async saveContent(content: string) {
		const fileName = `Edited Content ${new Date().toISOString().replace(/[:.]/g, '-')}.md`;
		const filePath = `Edited Contents/${fileName}`;

		try {
			// 创建目录
			await this.ensureDirectoryExists('Edited Contents');

			// 保存内容到文件
			await this.app.vault.create(filePath, content);

			new Notice('Content saved successfully.');
		} catch (error) {
			new Notice('Failed to save content.');
			console.error(error);
		}
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty(); // 清空内容
	}
}
