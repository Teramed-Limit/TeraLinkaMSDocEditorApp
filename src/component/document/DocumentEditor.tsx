import { useCallback } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { QueryKeys, useDocumentConfigQuery } from '../../api/queries';
import { queryClient } from '../../api/query-client';
import { globalStore } from '../../config/global-store';
import { useDocumentEditor } from '../../hooks/useDocumentEditor';
import { DocumentEditorLayout } from './DocumentEditorLayout';

// 定義文檔訪問模式類型
type DocumentMode = 'view' | 'edit' | 'fillForms';

/**
 * 文檔編輯器頁面，用於查看和編輯文檔
 */
function DocumentEditorPage() {
	const { id, mode } = useParams<{ id: string; mode: DocumentMode }>();
	const navigate = useNavigate();

	// 查詢文檔數據
	const { data: documentConfig, isLoading, isError } = useDocumentConfigQuery(id as string, mode as string);

	const { error, token, handleLoadComponentError, handleEvent } = useDocumentEditor({
		documentConfig,
		id,
		JWT_SECRET: globalStore.JWT_SECRET,
	});

	/**
	 * 返回文檔列表
	 */
	const handleBack = useCallback(() => {
		navigate('/documents');
	}, [navigate]);

	/**
	 * 返回文檔列表
	 */
	const handleNewDoc = useCallback(() => {
		queryClient.invalidateQueries({ queryKey: [QueryKeys.DOCUMENT_DETAIL, id] });
	}, [id]);

	return (
		<DocumentEditorLayout
			isLoading={isLoading}
			isError={isError}
			documentConfig={documentConfig}
			error={error}
			token={token}
			handleLoadComponentError={handleLoadComponentError}
			handleEvent={handleEvent}
			handleBack={handleBack}
			handleNewDoc={handleNewDoc}
		/>
	);
}

export default DocumentEditorPage;
