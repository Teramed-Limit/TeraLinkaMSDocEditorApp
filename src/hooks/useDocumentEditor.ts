import { useCallback, useEffect, useState } from 'react';

import { SignJWT } from 'jose';
import { useNavigate } from 'react-router-dom';

// JWT 秘鑰 - 應移至環境變量
// const JWT_SECRET = 'gBZcU2TEXgf2mnDCxO2N7kAx6XOkwo';
// 將字符串轉換為 Uint8Array (jose 需要 Uint8Array 格式的密鑰)

// Token 過期時間設定
const TOKEN_EXPIRATION = '24h';

interface UseDocumentEditorProps {
	documentConfig: any | null;
	id?: string;
	JWT_SECRET: string | null;
}

export const useDocumentEditor = ({ documentConfig, id, JWT_SECRET }: UseDocumentEditorProps) => {
	const navigate = useNavigate();
	const [error, setError] = useState<string | null>(null);
	const [token, setToken] = useState<string>('');
	const [currentDocId, setCurrentDocId] = useState<string>('');

	/**
	 * 生成JWT token，使用 jose 庫
	 */
	const generateToken = useCallback(async () => {
		if (!documentConfig || !JWT_SECRET) return '';

		const JWT_SECRET_BYTES = new TextEncoder().encode(JWT_SECRET);
		try {
			setCurrentDocId(documentConfig.document.docId);
			// 使用 jose 創建 JWT token
			return await new SignJWT({ ...documentConfig } as unknown as Record<string, string>)
				.setProtectedHeader({ alg: 'HS256' }) // 設置算法
				.setIssuedAt() // 設置發行時間
				.setExpirationTime(TOKEN_EXPIRATION) // 設置過期時間
				.sign(JWT_SECRET_BYTES); // 使用密鑰簽名
		} catch (err) {
			console.error('生成 token 時發生錯誤:', err);
			setError('生成安全 token 時發生錯誤');
			return '';
		}
	}, [documentConfig, JWT_SECRET]);

	// 當文檔數據改變時生成新的 token
	useEffect(() => {
		if (documentConfig) {
			generateToken().then((newToken) => {
				if (newToken) setToken(newToken);
			});
		}
	}, [documentConfig, generateToken]);

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
		console.log(`事件觸發: ${eventName}`, e);
		// if (eventName === 'onRequestRename') {
		// }
	};

	// 如果沒有文檔ID，返回列表頁
	useEffect(() => {
		if (!id) {
			navigate('/documents');
		}
	}, [id, navigate]);

	return {
		currentDocId,
		error,
		token,
		handleLoadComponentError,
		handleEvent,
	};
};
