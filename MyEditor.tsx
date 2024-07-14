// MyEditor.tsx
import React, { useState } from 'react';
import { Button, Space, DatePicker, version } from 'antd';


export const MyEditor = () => {
	const [editorHtml, setEditorHtml] = useState('');

	const handleChange = (html: string) => {
		setEditorHtml(html);
	};

	return (
		<div style={{padding: '0 24px'}}>
			<h1>antd version: {version}</h1>
			<Space>
				<DatePicker/>
				<Button type="primary">Primary Button</Button>
			</Space>
		</div>
	);
};

