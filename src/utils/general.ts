import { RefObject } from 'react';

import * as R from 'ramda';

export const generateUUID = () => {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
	}

	return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
};

export const coerceArray = (ary: string | any[]) => {
	if (Array.isArray(ary)) {
		return ary;
	}
	return [ary];
};

export const getRefElement = (element?: RefObject<Element>): Element | undefined | null => {
	if (element && 'current' in element) {
		return element.current;
	}

	return element;
};

export const isEmptyOrNil = (value: any) => {
	return R.isEmpty(value) || R.isNil(value);
};

export const isNotEmptyOrNil = (value: any) => {
	return !R.isEmpty(value) && !R.isNil(value);
};

export const isEmptyList = (value: any[] | undefined) => {
	if (!value) return false;
	return value?.length === 0;
};

export const isNotEmptyList = (value: any[] | undefined) => {
	if (!value) return false;
	return value?.length > 0;
};

export function uniqBy(list: any[], key) {
	const seen = {};
	return list.filter((item) => {
		const k = key(item);
		return Object.prototype.hasOwnProperty.call(seen, k) ? false : (seen[k] = true);
	});
}

export const reorder = <T>(list: Array<T>, startIndex, endIndex): Array<T> => {
	const result = [...list];
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);
	return result.slice();
};

export function extractSvgIds(svgContent: string): string[] {
	// 修改正則表達式以支援多行匹配
	const idPattern = /<[^>]+id="([^"]+)"[^>]*>/gs;
	const ids: string[] = [];

	// 使用 matchAll 找出所有匹配項
	const matches = svgContent.matchAll(idPattern);

	// 將匹配結果轉換成陣列
	// eslint-disable-next-line no-restricted-syntax
	for (const match of matches) {
		if (match[1]) {
			ids.push(match[1]);
		}
	}

	// 移除重複的 id
	return [...new Set(ids)];
}

// 計算年紀
export function calcAge(dob: Date): number {
	// 計算從出生日期到現在的年齡
	const today = new Date();
	const birthDate = new Date(dob);

	// 計算年份差異
	let age = today.getFullYear() - birthDate.getFullYear();

	// 檢查是否已經過了生日
	const monthDiff = today.getMonth() - birthDate.getMonth();
	if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
		age--;
	}

	return age;
}
