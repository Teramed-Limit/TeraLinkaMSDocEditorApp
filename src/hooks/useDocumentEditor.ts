import { useCallback, useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

interface UseDocumentEditorProps {
	id?: string;
}

export const useDocumentEditor = ({ id }: UseDocumentEditorProps) => {
	const navigate = useNavigate();
	const [error, setError] = useState<string | null>(null);

	/**
	 * 處理組件加載錯誤事件
	 */
	const handleLoadComponentError = useCallback((errorCode: number, errorDescription: string) => {
		switch (errorCode) {
			case -1: // 未知錯誤
				setError(`載入組件時發生未知錯誤：${errorDescription}`);
				break;

			case -2: // 無法加載文檔服務器
				setError(`無法從文檔服務器加載API：${errorDescription}`);
				break;

			case -3: // DocsAPI 未定義
				setError(`文檔API未定義：${errorDescription}`);
				break;

			default:
				setError(`發生錯誤：${errorDescription}`);
				break;
		}
	}, []);

	/**
	 * 處理文檔編輯器事件
	 */
	const handleEvent = (eventName: string, e: any) => {
		// 使用事件名稱和事件對象一起記錄，方便識別觸發的事件
		// console.log(`事件觸發: ${eventName}`, e);
	};

	// 如果沒有文檔ID，返回列表頁
	useEffect(() => {
		if (!id) {
			navigate('/documents');
		}
	}, [id, navigate]);

	return {
		error,
		handleLoadComponentError,
		handleEvent,
	};
};
