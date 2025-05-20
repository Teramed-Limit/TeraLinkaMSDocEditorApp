import { v4 as uuidv4 } from 'uuid';

import { globalStore } from '../config/global-store';
import { CreateDocumentRequest, Document, DocumentActionResult, DocumentEditorConfig } from '../types/document';
import { ApiService } from './ApiService';

/**
 * 文檔服務類，處理文檔的增刪改查操作
 */
class DocumentService {
	private static instance: DocumentService;
	private baseUrl = globalStore.IP_ADDRESS;

	/**
	 * 獲取文檔服務實例
	 */
	public static getInstance(): DocumentService {
		if (!this.instance) {
			this.instance = new DocumentService();
		}
		return this.instance;
	}

	/**
	 * 獲取文檔列表
	 * @returns 文檔列表回應
	 */
	async getDocuments(): Promise<Document[]> {
		try {
			const response = await ApiService.getInstance().get<Document[]>(`${this.baseUrl}/document`);
			return response.data;
		} catch (error) {
			console.error('獲取文檔列表失敗:', error);
			return [];
		}
	}

	async getDocumentTemplates(): Promise<Document[]> {
		try {
			const response = await ApiService.getInstance().get<Document[]>(`${this.baseUrl}/documentTemplate`);
			return response.data;
		} catch (error) {
			console.error('獲取文檔列表失敗:', error);
			return [];
		}
	}

	/**
	 * 取得單一文檔編輯設定
	 * @param id 文檔ID
	 * @param fileType 檔案類型，預設 docx
	 * @param templateId 模板ID
	 * @param forceSwitchTemplate 強制切換模板
	 * @returns 文檔編輯設定
	 */
	async getDocumentConfigById(
		id: string,
		mode: string,
		templateId?: string,
		forceSwitchTemplate?: boolean,
	): Promise<DocumentEditorConfig | null> {
		try {
			// 如果templateId為空，則不添加templateId參數
			const templateIdParam = templateId ? `&templateId=${templateId}` : '';
			// 如果forceSwitchTemplate為true，則添加forceSwitchTemplate參數
			const forceSwitchTemplateParam = forceSwitchTemplate ? `&forceSwitchTemplate=${forceSwitchTemplate}` : '';
			const response = await ApiService.getInstance().get<DocumentEditorConfig>(
				`${this.baseUrl}/document/${id}?mode=${mode}${templateIdParam}${forceSwitchTemplateParam}`,
			);
			return response.data;
		} catch (error) {
			console.error(`獲取文檔 ID: ${id} 失敗:`, error);
			return null;
		}
	}

	/**
	 * 創建新文檔
	 * @param documentData 文檔數據
	 * @returns 創建結果
	 */
	async createDocument(documentData: CreateDocumentRequest): Promise<DocumentActionResult> {
		try {
			// 生成唯一鍵值
			const documentKey = uuidv4();
			const response = await ApiService.getInstance().post<DocumentActionResult>(
				`${this.baseUrl}/document`,
				// 	{
				// 	 ...documentData,
				// 	 key: documentKey,
				// }
			);
			return response.data;
		} catch (error) {
			console.error('創建文檔失敗:', error);
			return { success: false, message: '創建文檔失敗' };
		}
	}

	/**
	 * 刪除文檔
	 * @param id 文檔ID
	 * @returns 刪除結果
	 */
	async deleteDocument(id: string): Promise<DocumentActionResult> {
		try {
			const response = await ApiService.getInstance().delete<DocumentActionResult>(
				`${this.baseUrl}/document/${id}`,
			);
			return response.data;
		} catch (error) {
			console.error(`刪除文檔 ID: ${id} 失敗:`, error);
			return { success: false, message: '刪除文檔失敗' };
		}
	}
}

export default DocumentService;
