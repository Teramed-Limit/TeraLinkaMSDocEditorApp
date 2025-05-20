import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { defaultOnError, defaultOnSuccess } from '../api/mutation';
import { globalStore } from '../config/global-store';

/**
 * 使用帶有默認處理程序的 mutation hook
 * 同時執行自定義和默認的成功/錯誤處理程序
 *
 * @param options 普通的 mutation 選項
 * @param customOptions 自定義選項
 * @returns mutation 結果
 */
export function useMutationWithDefaults<TData = unknown, TError = unknown, TVariables = void, TContext = unknown>(
	options: UseMutationOptions<TData, TError, TVariables, TContext>,
	customOptions?: {
		/**
		 * 是否禁用默認的成功通知
		 * 如果你在自定義 onSuccess 中已經顯示了通知，可以設置為 true
		 */
		disableDefaultSuccessNotification?: boolean;
		/**
		 * 是否禁用默認的錯誤通知
		 * 如果你在自定義 onError 中已經顯示了通知，可以設置為 true
		 */
		disableDefaultErrorNotification?: boolean;
		/**
		 * 默認的成功通知訊息
		 */
		defaultSuccessMessage?: string;
		/**
		 * 默認的錯誤通知訊息
		 */
		defaultErrorMessage?: string;
	},
): UseMutationResult<TData, TError, TVariables, TContext> {
	const { t } = useTranslation();

	const { onSuccess, onError, ...restOptions } = options;
	const {
		disableDefaultSuccessNotification = false,
		disableDefaultErrorNotification = false,
		defaultSuccessMessage,
		defaultErrorMessage,
	} = customOptions || {};

	// 檢查是否自定義處理程序中已顯示通知
	let hasShownSuccessNotification = false;
	let hasShownErrorNotification = false;

	// 原始的 setSnackbar 函數
	const originalSetSnackbar = globalStore.setSnackbar;

	return useMutation<TData, TError, TVariables, TContext>({
		...restOptions,
		onSuccess: (data, variables, context) => {
			// 暫時替換 setSnackbar 函數來檢測是否已顯示通知
			if (!disableDefaultSuccessNotification) {
				globalStore.setSnackbar = (...args: any[]) => {
					hasShownSuccessNotification = true;
					return originalSetSnackbar?.(...args);
				};
			}

			// 執行自定義的處理程序
			if (onSuccess) {
				onSuccess(data, variables, context);
			}

			// 恢復原始的 setSnackbar 函數
			globalStore.setSnackbar = originalSetSnackbar;

			// 如果自定義處理程序沒有顯示通知，且未禁用默認通知，則執行默認處理程序
			if (!hasShownSuccessNotification && !disableDefaultSuccessNotification) {
				defaultOnSuccess({ message: defaultSuccessMessage || t('defaultSuccessMessage') });
			}
		},
		onError: (error, variables, context) => {
			// 暫時替換 setSnackbar 函數來檢測是否已顯示通知
			if (!disableDefaultErrorNotification) {
				globalStore.setSnackbar = (...args: any[]) => {
					hasShownErrorNotification = true;
					return originalSetSnackbar?.(...args);
				};
			}

			// 執行自定義的處理程序
			if (onError) {
				onError(error, variables, context);
			}

			// 恢復原始的 setSnackbar 函數
			globalStore.setSnackbar = originalSetSnackbar;

			// 如果自定義處理程序沒有顯示通知，且未禁用默認通知，則執行默認處理程序
			if (!hasShownErrorNotification && !disableDefaultErrorNotification) {
				defaultOnError(error, { message: defaultErrorMessage || t('defaultErrorMessage') });
			}
		},
	});
}
