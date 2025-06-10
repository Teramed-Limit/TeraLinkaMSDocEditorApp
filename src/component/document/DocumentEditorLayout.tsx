import { ReactNode } from 'react';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Alert, Box, Button, CircularProgress, Paper } from '@mui/material';

import { DocumentEditorConfig, DocumentErrorHandler, DocumentEventHandler } from '../../types/document';
import { BaseDocumentEditor } from './BaseDocumentEditor';

interface DocumentEditorLayoutProps {
	isLoading: boolean;
	isError: boolean;
	documentConfig?: DocumentEditorConfig | null;
	error: string | null;
	handleLoadComponentError: DocumentErrorHandler;
	handleEvent: DocumentEventHandler;
	handleBack: () => void;
	handleNewDoc: () => void;
	headerContent?: ReactNode;
}

/**
 * 文檔編輯器共用佈局組件
 * 包含頂部導航欄、加載狀態、錯誤處理和基礎編輯器
 */
export function DocumentEditorLayout({
	isLoading,
	isError,
	documentConfig,
	error,
	handleLoadComponentError,
	handleEvent,
	handleBack,
	handleNewDoc,
	headerContent,
}: DocumentEditorLayoutProps) {
	if (isLoading) {
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
				<CircularProgress />
			</Box>
		);
	}

	if (isError || !documentConfig) {
		return (
			<Box sx={{ p: 3 }}>
				<Alert severity="error">無法加載文檔數據。請稍後再試。</Alert>
				<Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mt: 2 }} variant="contained">
					返回文檔列表
				</Button>
			</Box>
		);
	}

	const handleSaveStatusChange = (status: string) => {
		console.log('status', status);
	};

	return (
		<>
			<Paper
				sx={{
					p: 2,
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					gap: 2,
					borderRadius: 0,
					bgcolor: '#446995',
					color: 'white',
				}}
			>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
					<Button
						startIcon={<ArrowBackIcon />}
						onClick={handleBack}
						variant="contained"
						sx={{
							bgcolor: 'white',
							color: '#446995',
							'&:hover': {
								bgcolor: '#e0e0e0',
							},
						}}
					>
						返回
					</Button>
					{headerContent}
				</Box>
				<Button
					onClick={handleNewDoc}
					variant="contained"
					sx={{
						bgcolor: 'white',
						color: '#446995',
						'&:hover': {
							bgcolor: '#e0e0e0',
						},
					}}
				>
					獲取最新版本
				</Button>
			</Paper>

			<BaseDocumentEditor
				error={error}
				documentConfig={documentConfig}
				handleLoadComponentError={handleLoadComponentError}
				handleEvent={handleEvent}
				onSaveStatusChange={handleSaveStatusChange}
			/>
		</>
	);
}
