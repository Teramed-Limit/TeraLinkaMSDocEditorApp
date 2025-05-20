import { useCallback, useState } from 'react';

import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
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

	const { data: documentTemplateList } = useDocumentsQuery();

	// 查詢文檔數據
	const {
		data: documentConfig,
		isLoading,
		isError,
	} = useDocumentConfigQuery(id as string, 'edit', selectedTemplate as string, forceSwitchTemplate);

	const { error, token, handleLoadComponentError, handleEvent } = useDocumentEditor({
		documentConfig,
		id: selectedTemplate,
		JWT_SECRET: globalStore.JWT_SECRET,
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

	const handleTemplateChange = (event: any) => {
		setSelectedTemplate(event.target.value);
		setForceSwitchTemplate(true);
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
			headerContent={templateSelector}
		/>
	);
}

export default DocumentSelectTemplateEditorPage;
