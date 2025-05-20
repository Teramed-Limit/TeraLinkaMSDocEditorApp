/**
 * 臨床單位介面定義
 */
interface ClinicalUnit {
	Puid: string;
	Location: string;
	DayBeginHour: number;
	DayBeginOffsetMinutes: number;
	DayDuration: number;
}

/**
 * 班別介面定義
 */
interface Shift {
	Puid: string;
	ClinicalUnitPuid: string;
	ShiftBeginHour: number;
	ShiftOffsetMinutes: number;
	ShiftDuration: number;
	ShiftShortLabel: string;
	ShiftLongLabel: string;
}

/**
 * 包含時間的班別介面
 */
interface ShiftWithTime extends Shift {
	shiftStartDate: Date;
	shiftEndDate: Date;
	isOvernight: boolean;
	clinicalDateString: string;
	shiftStartDateChinese: string;
	shiftEndDateChinese: string;
}

/**
 * 判斷指定時間屬於哪個班別，並計算相關日期時間資訊
 * @param dateTime - 要判斷的時間
 * @param clinicalUnits - 臨床單位資料
 * @param shifts - 班別資料
 * @returns 返回班別和時間資訊或null
 */
function determineShiftAndTime(dateTime: Date, clinicalUnits: ClinicalUnit[], shifts: Shift[]) {
	// 獲取小時和分鐘
	const hours = dateTime.getHours();
	const minutes = dateTime.getMinutes();

	// 將時間轉換為分鐘表示（從午夜開始）
	const timeInMinutes = hours * 60 + minutes;

	// 臨床日期計算（考慮到臨床日可能與自然日不同）
	const clinicalUnit = clinicalUnits[0]; // 假設使用第一個臨床單位
	const dayStartInMinutes = clinicalUnit.DayBeginHour * 60 + clinicalUnit.DayBeginOffsetMinutes;

	// 計算臨床日期
	const clinicalDate = new Date(dateTime);
	if (timeInMinutes < dayStartInMinutes) {
		// 如果當前時間早於日開始時間，則臨床日期為前一天
		clinicalDate.setDate(clinicalDate.getDate() - 1);
	}

	// 計算前一天的臨床日期（用於處理可能是前一天大夜班的情況）
	const prevClinicalDate = new Date(clinicalDate);
	prevClinicalDate.setDate(prevClinicalDate.getDate() - 1);

	// 計算各臨床日期的班別時間
	const calculateShiftTimesForDate = (baseDate: Date): ShiftWithTime[] => {
		const shiftsWithTimes: ShiftWithTime[] = [];

		// eslint-disable-next-line no-restricted-syntax
		for (const shift of shifts) {
			if (shift.ClinicalUnitPuid === clinicalUnit.Puid) {
				// 班別開始時間（分鐘表示）
				const shiftStartInMinutes = shift.ShiftBeginHour * 60 + shift.ShiftOffsetMinutes;
				// 班別結束時間（分鐘表示）
				const shiftEndInMinutes = shiftStartInMinutes + shift.ShiftDuration;

				// 建立該班別的開始和結束日期時間
				const shiftStartDate = new Date(baseDate);
				shiftStartDate.setHours(shift.ShiftBeginHour);
				shiftStartDate.setMinutes(shift.ShiftOffsetMinutes);
				shiftStartDate.setSeconds(0);

				const shiftEndDate = new Date(shiftStartDate);
				shiftEndDate.setMinutes(shiftStartDate.getMinutes() + shift.ShiftDuration);
				shiftEndDate.setSeconds(59);

				shiftsWithTimes.push({
					...shift,
					shiftStartDate,
					shiftEndDate,
					shiftStartDateChinese: shiftStartDate.toLocaleString(),
					shiftEndDateChinese: shiftEndDate.toLocaleString(),
					isOvernight: shiftEndInMinutes >= 24 * 60,
					clinicalDateString: formatDate(baseDate), // 添加班別所屬的臨床日期
				});
			}
		}

		return shiftsWithTimes;
	};

	// 計算當前臨床日期的班別
	const currentDateShifts = calculateShiftTimesForDate(clinicalDate);
	// 計算前一天臨床日期的班別（用於處理可能是前一天大夜班的情況）
	const prevDateShifts = calculateShiftTimesForDate(prevClinicalDate);

	// 所有可能的班別（當前日期和前一天的）
	const allPossibleShifts = [...currentDateShifts, ...prevDateShifts];

	// 找出當前班別
	let currentShift: ShiftWithTime | null = null;

	// eslint-disable-next-line no-restricted-syntax
	for (const shift of allPossibleShifts) {
		if (dateTime >= shift.shiftStartDate && dateTime <= shift.shiftEndDate) {
			currentShift = shift;
			break;
		}
	}

	if (currentShift) {
		return {
			clinicalUnitShift: currentShift.Puid,
			currentShift: {
				...currentShift,
				// 顯示班別的完整名稱，包含日期
				fullShiftName: `${formatDateChinese(new Date(currentShift.clinicalDateString))} ${currentShift.ShiftLongLabel}`,
			},
			clinicalDate: formatDate(clinicalDate),
			clinicalDateChinese: formatDateChinese(clinicalDate),
			naturalDate: formatDate(dateTime),
			naturalDateChinese: formatDateChinese(dateTime),
		};
	}

	return null;
}

/**
 * 格式化日期時間顯示
 * @param date - 日期時間
 * @returns 格式化的日期時間字符串
 */
function formatDateTime(date: Date): string {
	return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

/**
 * 格式化日期顯示
 * @param date - 日期
 * @returns 格式化的日期字符串
 */
function formatDate(date: Date): string {
	return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}

/**
 * 格式化中文日期顯示
 * @param date - 日期
 * @returns 格式化的中文日期字符串
 */
function formatDateChinese(date: Date): string {
	return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

/**
 * 獲取當前班別和時間資訊，包括班別所屬日期
 * @param dateTime - 要判斷的時間，預設為當前時間
 * @returns 返回班別和時間資訊
 */
function getCurrentShiftInfo(dateTime = new Date()) {
	// 臨床單位資料
	const clinicalUnits: ClinicalUnit[] = [
		{
			Puid: 'C370C0F9-9D77-4CF9-AF6A-1DE5982B4BF0',
			Location: 'ICU2',
			DayBeginHour: 7,
			DayBeginOffsetMinutes: 1,
			DayDuration: 1439,
		},
	];

	// 班別資料
	const shifts: Shift[] = [
		{
			Puid: 'C3341244-5FB6-4625-A9E8-6179DE2287A9',
			ClinicalUnitPuid: 'C370C0F9-9D77-4CF9-AF6A-1DE5982B4BF0',
			ShiftBeginHour: 15,
			ShiftOffsetMinutes: 1,
			ShiftDuration: 479,
			ShiftShortLabel: 'E',
			ShiftLongLabel: '小夜班',
		},
		{
			Puid: '693A11E9-5513-4EB5-B7C5-7ABFEC639555',
			ClinicalUnitPuid: 'C370C0F9-9D77-4CF9-AF6A-1DE5982B4BF0',
			ShiftBeginHour: 7,
			ShiftOffsetMinutes: 1,
			ShiftDuration: 479,
			ShiftShortLabel: 'D',
			ShiftLongLabel: '白班',
		},
		{
			Puid: 'AF11F7D0-D5E8-462C-9A4D-F6EA5624F280',
			ClinicalUnitPuid: 'C370C0F9-9D77-4CF9-AF6A-1DE5982B4BF0',
			ShiftBeginHour: 23,
			ShiftOffsetMinutes: 1,
			ShiftDuration: 479,
			ShiftShortLabel: 'N',
			ShiftLongLabel: '大夜班',
		},
	];

	// 調用判斷班別和時間的函數
	const result = determineShiftAndTime(dateTime, clinicalUnits, shifts);

	if (result) {
		return {
			inputTime: formatDateTime(dateTime),
			naturalDateChinese: result.naturalDateChinese,
			clinicalDateChinese: result.clinicalDateChinese,
			currentShift: {
				fullName: result.currentShift.fullShiftName,
			},
		};
	}
	return { error: '無法確定班別和時間資訊' };
}

// 測試函數
// export const testShiftAndTimeInfo = () => {
// 	// 測試不同時間點
// 	const testTimes = [
// 		new Date(2025, 2, 17, 15, 0, 21, 0),
// 		new Date(2025, 2, 17, 15, 1),
// 		new Date(2025, 2, 17, 7, 0),
// 		new Date(2025, 2, 17, 7, 1),
// 		new Date(2025, 2, 17, 23, 0),
// 		new Date(2025, 2, 17, 23, 1),
// 	];

// 	testTimes.forEach((time) => {
// 		const result = getCurrentShiftInfo(time);
// 		console.log('===========================');
// 		console.log(`測試時間: ${result.inputTime}`);
// 		console.log(`自然日期: ${result.naturalDateChinese}`);
// 		console.log(`臨床日期: ${result.clinicalDateChinese}`);
// 		console.log(`當前班別: ${result.currentShift?.fullName}`);
// 		console.log('===========================');
// 	});
// };

// 執行測試
// testShiftAndTimeInfo();
