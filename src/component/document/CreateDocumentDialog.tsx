import { useState } from 'react';

import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	FormHelperText,
	InputLabel,
	MenuItem,
	Select,
	TextField,
} from '@mui/material';

import { useCreateDocumentMutation } from '../../api/queries';

interface CreateDocumentDialogProps {
	open: boolean;
	onClose: () => void;
}

/**
 * 創建文檔對話框組件
 */
function CreateDocumentDialog({ open, onClose }: CreateDocumentDialogProps) {
	const [title, setTitle] = useState('');
	const [fileType, setFileType] = useState('docx');
	const [titleError, setTitleError] = useState('');

	// 創建文檔變更
	const createMutation = useCreateDocumentMutation();

	/**
	 * 處理標題變更
	 */
	const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(event.target.value);
		if (event.target.value.trim()) {
			setTitleError('');
		}
	};

	/**
	 * 處理檔案類型變更
	 */
	const handleFileTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		setFileType(event.target.value as string);
	};

	/**
	 * 處理對話框關閉
	 */
	const handleClose = () => {
		// 重置表單
		setTitle('');
		setFileType('docx');
		setTitleError('');
		onClose();
	};

	/**
	 * 處理文檔創建
	 */
	const handleCreate = async () => {
		// 驗證輸入
		if (!title.trim()) {
			setTitleError('文檔標題不能為空');
			return;
		}

		try {
			// 執行創建文檔
			await createMutation.mutateAsync({
				title: title.trim(),
				fileType,
			});

			// 關閉對話框並重置表單
			handleClose();
		} catch (error) {
			console.error('創建文檔失敗:', error);
		}
	};

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
			<DialogTitle>新增文檔</DialogTitle>
			<DialogContent>
				<TextField
					autoFocus
					margin="dense"
					id="title"
					label="文檔標題"
					type="text"
					fullWidth
					value={title}
					onChange={handleTitleChange}
					error={!!titleError}
					helperText={titleError}
					sx={{ mb: 2, mt: 1 }}
				/>

				<FormControl fullWidth error={false}>
					<InputLabel id="file-type-label">文檔類型</InputLabel>
					<Select
						labelId="file-type-label"
						id="file-type"
						value={fileType}
						onChange={handleFileTypeChange}
						label="文檔類型"
					>
						<MenuItem value="docx">Word 文檔 (.docx)</MenuItem>
						<MenuItem value="xlsx">Excel 電子表格 (.xlsx)</MenuItem>
						<MenuItem value="pptx">PowerPoint 演示文稿 (.pptx)</MenuItem>
					</Select>
					<FormHelperText>選擇您想要創建的文檔類型</FormHelperText>
				</FormControl>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} color="primary">
					取消
				</Button>
				<Button onClick={handleCreate} color="primary" variant="contained" disabled={createMutation.isPending}>
					創建
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default CreateDocumentDialog;
