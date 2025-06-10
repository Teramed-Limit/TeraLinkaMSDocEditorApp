import { useCallback, useState } from 'react';

import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Button,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

import { QueryKeys, useDocumentConfigQuery, useDocumentsQuery } from '../../api/queries';
import { queryClient } from '../../api/query-client';
import { globalStore } from '../../config/global-store';
import { useDocumentEditor } from '../../hooks/useDocumentEditor';
import { DocumentEditorLayout } from './DocumentEditorLayout';

/**
 * 文檔編輯器頁面，用於查看和編輯文檔
 */
function DocumentSelectTemplateEditorPage() {
	const searchParams = new URLSearchParams(window.location.search);
	const { id } = useParams<{ id: string }>();

	const templateId = searchParams.get('templateId');
	const navigate = useNavigate();
	const [selectedTemplate, setSelectedTemplate] = useState<string>(templateId || '');
	const [forceSwitchTemplate, setForceSwitchTemplate] = useState<boolean>(false);
	const [dialogOpen, setDialogOpen] = useState<boolean>(false);
	const [pendingTemplateId, setPendingTemplateId] = useState<string>('');

	const { data: documentTemplateList } = useDocumentsQuery();

	// 查詢文檔數據
	const {
		data: documentConfig,
		isLoading,
		isError,
	} = useDocumentConfigQuery(id as string, 'edit', selectedTemplate as string, forceSwitchTemplate);

	const { error, handleLoadComponentError, handleEvent } = useDocumentEditor({
		id: selectedTemplate,
	});

	/**
	 * 返回文檔列表
	 */
	const handleBack = useCallback(() => {
		navigate('/documentTemplate');
	}, [navigate]);

	/**
	 * 返回文檔列表
	 */
	const handleNewDoc = useCallback(() => {
		queryClient.invalidateQueries({ queryKey: [QueryKeys.DOCUMENT_DETAIL, id] });
	}, [id]);

	/**
	 * 處理範本變更
	 */
	const handleTemplateChange = (event: any) => {
		const newTemplateId = event.target.value;
		if (selectedTemplate && selectedTemplate !== newTemplateId) {
			setPendingTemplateId(newTemplateId);
			setDialogOpen(true);
		} else {
			setSelectedTemplate(newTemplateId);
			setForceSwitchTemplate(true);
		}
	};

	/**
	 * 確認切換範本
	 */
	const handleConfirmTemplateChange = () => {
		setSelectedTemplate(pendingTemplateId);
		setForceSwitchTemplate(true);
		setDialogOpen(false);
	};

	/**
	 * 取消切換範本
	 */
	const handleCancelTemplateChange = () => {
		setPendingTemplateId('');
		setDialogOpen(false);
	};

	const templateSelector = (
		<FormControl sx={{ minWidth: 200 }}>
			<InputLabel
				id="template-select-label"
				sx={{
					color: 'rgba(255, 255, 255, 0.7)',
					'&.Mui-focused': {
						color: 'white',
					},
				}}
			>
				選擇範本
			</InputLabel>
			<Select
				labelId="template-select-label"
				value={selectedTemplate}
				onChange={handleTemplateChange}
				label="選擇範本"
				size="small"
				sx={{
					color: 'white',
					'.MuiOutlinedInput-notchedOutline': {
						borderColor: 'rgba(255, 255, 255, 0.5)',
					},
					'&:hover .MuiOutlinedInput-notchedOutline': {
						borderColor: 'rgba(255, 255, 255, 0.7)',
					},
					'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
						borderColor: 'white',
					},
					'.MuiSvgIcon-root': {
						color: 'white',
					},
				}}
			>
				{documentTemplateList
					?.filter((template) => template.isTemplate)
					.map((template) => (
						<MenuItem key={template.id} value={template.id}>
							{template.fileName}
						</MenuItem>
					))}
			</Select>
		</FormControl>
	);

	return (
		<>
			<DocumentEditorLayout
				isLoading={isLoading}
				isError={isError}
				documentConfig={documentConfig}
				error={error}
				handleLoadComponentError={handleLoadComponentError}
				handleEvent={handleEvent}
				handleBack={handleBack}
				handleNewDoc={handleNewDoc}
				headerContent={templateSelector}
			/>

			<Dialog
				open={dialogOpen}
				onClose={handleCancelTemplateChange}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">確認切換範本？</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						切換範本將會遺失目前的所有報告內容。確定要繼續嗎？
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCancelTemplateChange} color="primary">
						取消
					</Button>
					<Button onClick={handleConfirmTemplateChange} color="error" autoFocus>
						確認切換
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}

export default DocumentSelectTemplateEditorPage;
