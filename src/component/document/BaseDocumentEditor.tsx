import { useEffect } from 'react';

import { Alert, Box } from '@mui/material';
import { DocumentEditor } from '@onlyoffice/document-editor-react';

import SignalRService from '../../services/SignalRService';
import { DocumentEditorConfig } from '../../types/document';

interface BaseDocumentEditorProps {
	error: string | null;
	documentConfig: DocumentEditorConfig;
	handleLoadComponentError: (errorCode: number, errorDescription: string) => void;
	handleEvent: (eventName: string, e: any) => void;
	onSaveStatusChange?: (status: string) => void;
}

export function BaseDocumentEditor({
	error,
	documentConfig,
	handleLoadComponentError,
	handleEvent,
	onSaveStatusChange,
}: BaseDocumentEditorProps) {
	// 初始化 SignalR 服務
	useEffect(() => {
		if (!documentConfig) return;

		const signalRService = SignalRService.getInstance();

		// 連接 SignalR
		signalRService.startConnection();

		// 註冊儲存狀態變更處理程序
		const handleSaveStatus = (docId: string, status: string) => {
			const documentId = documentConfig.document?.docId;
			if (docId === documentId && onSaveStatusChange) {
				onSaveStatusChange(status);
			}
		};

		signalRService.onSaveStatus(handleSaveStatus);

		// 清理函數
		return () => {
			signalRService.offSaveStatus(handleSaveStatus);
		};
	}, [documentConfig, documentConfig.document?.docId, onSaveStatusChange]);

	return (
		<Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
			{error && (
				<Alert severity="error" sx={{ m: 2 }}>
					{error}
				</Alert>
			)}

			<Box sx={{ flex: 1, p: 0, m: 0 }}>
				{documentConfig && (
					<DocumentEditor
						id="docxEditor"
						documentServerUrl="http://localhost"
						config={{ ...documentConfig }}
						// 添加事件處理程序
						onLoadComponentError={handleLoadComponentError}
						events_onAppReady={(e) => handleEvent('onAppReady', e)}
						events_onDocumentStateChange={(e) => handleEvent('onDocumentStateChange', e)}
						events_onMetaChange={(e) => handleEvent('onMetaChange', e)}
						events_onDocumentReady={(e) => handleEvent('onDocumentReady', e)}
						events_onInfo={(e) => handleEvent('onInfo', e)}
						events_onWarning={(e) => handleEvent('onWarning', e)}
						events_onError={(e) => handleEvent('onError', e)}
						events_onRequestSharingSettings={(e) => handleEvent('onRequestSharingSettings', e)}
						events_onRequestRename={(e) => handleEvent('onRequestRename', e)}
						events_onMakeActionLink={(e) => handleEvent('onMakeActionLink', e)}
						events_onRequestInsertImage={(e) => handleEvent('onRequestInsertImage', e)}
						events_onRequestSaveAs={(e) => handleEvent('onRequestSaveAs', e)}
						events_onRequestEditRights={(e) => handleEvent('onRequestEditRights', e)}
						events_onRequestHistory={(e) => handleEvent('onRequestHistory', e)}
						events_onRequestHistoryClose={(e) => handleEvent('onRequestHistoryClose', e)}
						events_onRequestHistoryData={(e) => handleEvent('onRequestHistoryData', e)}
						events_onRequestRestore={(e) => handleEvent('onRequestRestore', e)}
						events_onRequestSelectSpreadsheet={(e) => handleEvent('onRequestSelectSpreadsheet', e)}
						events_onRequestSelectDocument={(e) => handleEvent('onRequestSelectDocument', e)}
						events_onRequestUsers={(e) => handleEvent('onRequestUsers', e)}
					/>
				)}
			</Box>
		</Box>
	);
}
