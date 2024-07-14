import axios from 'axios';

export async function fetchData(url: string): Promise<void> {
	try {
		const response = await axios.get(url);
		console.log(response.data);
	} catch (error) {
		console.error('请求失败:', error);
	}
}

// 使用示例
fetchData('https://restapi.amap.com/v3/ip?key=5fa9f5cc69404e6a7299afac184fab7e');
