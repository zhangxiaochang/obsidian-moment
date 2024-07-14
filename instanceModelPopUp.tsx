// ExampleModal.tsx
import { Modal, App } from "obsidian";
// @ts-ignore
import React from "react";
import { createRoot, Root } from "react-dom/client";

export class ExampleModal extends Modal {
	root: Root | null = null;

	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
        debugger
		// 创建 React 渲染根节点
		this.root = createRoot(contentEl);
		this.root.render(
			<React.StrictMode>
				<ReactView />
			</React.StrictMode>
		);
	}

	onClose() {
		// 清理 React 组件
		this.root?.unmount();
	}
}
