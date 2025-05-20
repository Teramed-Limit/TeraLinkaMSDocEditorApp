import { globalStore } from '../config/global-store';

// 定義全局默認的 onSuccess 處理函數
export const defaultOnSuccess = (context: any) => {
	if (globalStore.setSnackbar) {
		globalStore.setSnackbar({
			open: true,
			message: context?.message || '操作成功',
			severity: 'success',
		});
	}
};

// 定義全局默認的 onError 處理函數
export const defaultOnError = (error: any, context: any) => {
	if (globalStore.setSnackbar) {
		globalStore.setSnackbar({
			open: true,
			message: context?.message || '操作失敗',
			severity: 'error',
		});
		console.error(error);
	}
};
