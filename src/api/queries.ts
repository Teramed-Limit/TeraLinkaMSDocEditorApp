import { useMutation, useQuery } from '@tanstack/react-query';

import DocumentService from '../services/DocumentService';
import { CreateDocumentRequest } from '../types/document';
import { queryClient } from './query-client';

/**
 * 查詢鍵定義
 */
export const QueryKeys = {
	DOCUMENTS: 'documents',
	DOCUMENT_DETAIL: 'document_detail',
};

/**
 * 使用查詢獲取文檔列表
 */
export const useDocumentsQuery = () => {
	return useQuery({
		queryKey: [QueryKeys.DOCUMENTS],
		queryFn: () => DocumentService.getInstance().getDocuments(),
	});
};

/**
 * 使用查詢獲取文檔編輯設定
 * @param id 文檔ID
 * @param fileType 檔案類型，預設 docx
 * @param templateId 模板ID
 * @param forceSwitchTemplate 強制切換模板
 */
export const useDocumentConfigQuery = (
	id: string,
	mode: string,
	templateId?: string,
	forceSwitchTemplate?: boolean,
) => {
	return useQuery({
		// eslint-disable-next-line @tanstack/query/exhaustive-deps
		queryKey: [QueryKeys.DOCUMENT_DETAIL, id, mode, templateId],
		queryFn: () => DocumentService.getInstance().getDocumentConfigById(id, mode, templateId, forceSwitchTemplate),
		enabled: !!id, // 只有當 id 存在時才執行查詢
		staleTime: 0, // 查詢完立即過期
	});
};

/**
 * 使用變更創建文檔
 */
export const useCreateDocumentMutation = () => {
	return useMutation({
		mutationFn: (documentData: CreateDocumentRequest) => {
			return DocumentService.getInstance().createDocument(documentData);
		},
		onSuccess: () => {
			// 成功創建後，使文檔列表查詢失效以觸發重新獲取
			queryClient.invalidateQueries({ queryKey: [QueryKeys.DOCUMENTS] });
		},
	});
};

/**
 * 使用變更刪除文檔
 */
export const useDeleteDocumentMutation = () => {
	return useMutation({
		mutationFn: (id: string) => {
			return DocumentService.getInstance().deleteDocument(id);
		},
		onSuccess: () => {
			// 成功刪除後，使文檔列表查詢失效以觸發重新獲取
			queryClient.invalidateQueries({ queryKey: [QueryKeys.DOCUMENTS] });
		},
	});
};
