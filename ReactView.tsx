// main.tsx
import { Plugin, Modal } from 'obsidian';
import React from 'react';
import ReactDOM from 'react-dom';
import { MyEditor } from "D:/trace-feat/PKMS/.obsidian/plugins/moment/MyEditor"

export class RichTextModal extends Modal {
	constructor(app: any) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		// 在这里渲染 React 组件
		ReactDOM.render(<MyEditor />, contentEl);
	}

	onClose() {
		const { contentEl } = this;
		// 清除 React 组件的渲染
		ReactDOM.unmountComponentAtNode(contentEl);
		contentEl.empty();
	}
}
