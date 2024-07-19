import axios from 'axios';

interface requestResponse {
	status: number;
	message: string;
	data: object
}

export class requestUtils {
	// 静态方法
	public static async Get(url: string): Promise<requestResponse> {
		debugger
		if (url === undefined || url === "" || url === null) {
			return this.failed("url为空", null);
		}
		var response;
		try {
			response = await axios.get(url);
			return this.success(response.data);
		} catch (error) {
			console.error('请求失败:', error);
			return this.failed("请求失败", error);
		}
	}

	private static success(data: any): requestResponse {
		const status = 1;
		const message = "请求成功";
		return {
			status, message, data
		}
	}

	private static failed(message: string, data: any): requestResponse {
		const status = 0;
		return {
			status, message, data
		}
	}
}




