// 日期格式枚举
export interface DateTypeInfo {
	name: string;
	code: string;
}

export enum DateType {
	Lunar = "lunar",
	Gregorian = "gregorian"
}

export const DateTypes: { [key in DateType]: DateTypeInfo } = {
	[DateType.Lunar]: {name: '农历', code: "lunar"},
	[DateType.Gregorian]: {name: '公历', code: "gregorian"}
};
