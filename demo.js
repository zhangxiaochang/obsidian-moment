function dateAssemble(fileName) {
	const regex = /\d{4}-\d{2}\d{2}/; // 匹配日期前的字符，包括最后一个'-'和日期
	const match = fileName.match(regex);

	if (match) {
		const prefix = fileName.slice(0, -match[0].length-3); // 从原始文本中移除匹配的日期和'-'字符
		console.log(prefix); // 输出: RW-白板和主题保持一致
		console.log(match[0]);
	} else {
		console.log("No date found at the end of the text.");
	}
}

function splitString(inputString) {
	// 使用正则表达式匹配最后一个斜杠之前的所有内容
	const lastSlashIndex = inputString.lastIndexOf('/');
	if (lastSlashIndex !== -1) {
		const path = inputString.substring(0, lastSlashIndex+1);
		const fileName = inputString.substring(lastSlashIndex + 1);
		return {path,fileName}
	} else {
		return ["", inputString]; // 如果字符串中没有斜杠，则返回两个空字符串
		return {}; // 如果字符串中没有斜杠，则返回两个空字符串
	}
}

dateAssemble("RW-SOP支持问题-2024-0308.md")

