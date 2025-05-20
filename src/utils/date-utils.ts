import { format, parse } from 'date-fns';

export const stringFormatDate = (value: string, fromFormat: string): Date => parse(value, fromFormat, new Date());

export const dateFormatString = (value: string | Date | null | undefined, fromFormat = 'yyyyMMdd') => {
	if (!value) {
		return '';
	}
	try {
		if (value instanceof Date) {
			return format(value, fromFormat);
		}
		return format(new Date(value), fromFormat);
	} catch {
		return '';
	}
};

export const formatToDate = (value: string | Date | null | undefined): Date => {
	let date;
	if (value instanceof Date) {
		// 如果輸入的已經是 Date 物件，則直接返回
		date = value;
	} else if (typeof value === 'string') {
		// 否則，嘗試將輸入的字串解析為 Date 物件
		const parsedDate = new Date(value);
		// 檢查解析是否成功
		if (Number.isNaN(parsedDate.getTime())) {
			// 如果解析失敗（也就是說，parsedDate 是無效的 Date 物件），則拋出錯誤
			date = new Date();
		} else {
			// 如果解析成功，則返回解析後的 Date 物件
			date = parsedDate;
		}
	} else {
		date = new Date();
	}

	return date;
};
