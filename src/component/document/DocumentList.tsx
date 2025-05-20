import { useState } from 'react';

import {
	Add as AddIcon,
	Delete as DeleteIcon,
	Description as DescriptionIcon,
	Edit as EditIcon,
	PictureAsPdf as PictureAsPdfIcon,
	TableChart as TableChartIcon,
} from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import {
	Box,
	Button,
	Card,
	Container,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
	Paper,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	TextField,
	InputAdornment,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { useDeleteDocumentMutation } from '../../api/queries';
import { Document } from '../../types/document';
import { generateUUID } from '../../utils/general';
import CreateDocumentDialog from './CreateDocumentDialog';

/**
 * 根據檔案類型回傳對應的 icon 元件
 * @param fileType 檔案類型
 * @returns React 元素
 */
function getDocumentIcon(fileType: string) {
	switch (fileType?.toLowerCase()) {
		case 'pdf':
			return <PictureAsPdfIcon sx={{ mr: 1, color: 'error.main' }} />;
		case 'docx':
		case 'doc':
			return <DescriptionIcon sx={{ mr: 1, color: 'primary.main' }} />;
		case 'sheet':
		case 'xlsx':
		case 'xls':
			return <TableChartIcon sx={{ mr: 1, color: 'success.main' }} />;
		default:
			return <DescriptionIcon sx={{ mr: 1, color: 'primary.main' }} />;
	}
}

interface Props {
	title: string;
	documentList: Document[];
	handleQueryDoc: () => void;
}

/**
 * 文檔列表頁面，顯示所有可訪問的文檔並支持增刪改查操作
 */
function DocumentList({ title, documentList, handleQueryDoc }: Props) {
	const navigate = useNavigate();
	const [createDialogOpen, setCreateDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
	const [searchQuery, setSearchQuery] = useState('');

	// 過濾文件列表
	const filteredDocuments = documentList.filter((document) =>
		document.fileName.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	// 刪除文檔
	const deleteMutation = useDeleteDocumentMutation();

	/**
	 * 處理查看文檔
	 */
	// const handleView = (documentId: string) => {
	// 	navigate(`/documents/${documentId}/view`);
	// };

	/**
	 * 處理編輯文檔
	 */
	const handleEdit = (documentId: string) => {
		navigate(`/document/${documentId}/edit`);
	};

	const handleSelectTemplate = (templateId: string) => {
		navigate(`/document/${generateUUID()}/new?templateId=${templateId}`);
	};

	/**
	 * 處理編輯文檔
	 */
	// const handleFillForms = (documentId: string) => {
	// 	navigate(`/documents/${documentId}/fillForms`);
	// };

	/**
	 * 打開刪除確認對話框
	 */
	const openDeleteDialog = (document: Document) => {
		setSelectedDocument(document);
		setDeleteDialogOpen(true);
	};

	/**
	 * 取消刪除操作
	 */
	const handleCancelDelete = () => {
		setDeleteDialogOpen(false);
		setSelectedDocument(null);
	};

	/**
	 * 確認刪除文檔
	 */
	const handleConfirmDelete = async () => {
		if (selectedDocument) {
			try {
				await deleteMutation.mutateAsync(selectedDocument.id);
				setDeleteDialogOpen(false);
				setSelectedDocument(null);
			} catch (error) {
				console.error('刪除文檔失敗:', error);
			}
		}
	};

	/**
	 * 打開創建文檔對話框
	 */
	const handleOpenCreateDialog = () => {
		setCreateDialogOpen(true);
	};

	/**
	 * 關閉創建文檔對話框
	 */
	const handleCloseCreateDialog = () => {
		setCreateDialogOpen(false);
	};

	return (
		<Container maxWidth="lg" sx={{ py: 3 }}>
			<Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<Typography variant="h5" component="h1">
					{title}
				</Typography>
				<Stack direction="row" spacing={1}>
					<Button variant="contained" startIcon={<SearchIcon />} onClick={handleQueryDoc}>
						查詢
					</Button>
					<Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreateDialog}>
						新增文檔
					</Button>
				</Stack>
			</Box>

			<Card sx={{ mb: 4 }}>
				<Box sx={{ p: 2 }}>
					<TextField
						fullWidth
						variant="outlined"
						placeholder="搜尋文件名稱..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						sx={{ mb: 2 }}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon />
								</InputAdornment>
							),
						}}
					/>
					<TableContainer component={Paper}>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>文檔名稱</TableCell>
									<TableCell>類型</TableCell>
									<TableCell>最後更新時間</TableCell>
									<TableCell align="right">操作</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{filteredDocuments?.map((document: Document) => (
									<TableRow key={document.id} hover>
										<TableCell>
											<Box sx={{ display: 'flex', alignItems: 'center' }}>
												{getDocumentIcon(document.fileType)}
												{document.fileName}
											</Box>
										</TableCell>
										<TableCell>{document.fileType.toUpperCase()}</TableCell>
										<TableCell>
											{new Date(document.lastModifiedAt || '').toLocaleString('zh-TW')}
										</TableCell>
										<TableCell align="right">
											{/* <IconButton
											onClick={() => handleView(document.id, document.fileType)}
											color="primary"
											title="查看"
										>
											<DescriptionIcon />
										</IconButton> */}
											<IconButton
												onClick={() => handleEdit(document.id)}
												color="primary"
												title="編輯"
											>
												<EditIcon />
											</IconButton>
											{document.isTemplate && (
												<IconButton
													onClick={() => handleSelectTemplate(document.id)}
													color="success"
													title="選用此範本"
												>
													<DescriptionIcon />
												</IconButton>
											)}
											{/* <IconButton
											onClick={() => handleFillForms(document.id)}
											color="primary"
											title="填寫表單"
										>
											<DescriptionIcon />
										</IconButton> */}
											<IconButton
												onClick={() => openDeleteDialog(document)}
												color="error"
												title="刪除"
											>
												<DeleteIcon />
											</IconButton>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>

					{/* <TablePagination
					rowsPerPageOptions={[5, 10, 25]}
					component="div"
					count={data.total}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
					labelRowsPerPage="每頁行數:"
					labelDisplayedRows={({ from, to, count }) => `${from}-${to} 共 ${count}`}
				/> */}
				</Box>
			</Card>

			{/* 創建文檔對話框 */}
			<CreateDocumentDialog open={createDialogOpen} onClose={handleCloseCreateDialog} />

			{/* 刪除確認對話框 */}
			<Dialog
				open={deleteDialogOpen}
				onClose={handleCancelDelete}
				aria-labelledby="delete-dialog-title"
				aria-describedby="delete-dialog-description"
			>
				<DialogTitle id="delete-dialog-title">確認刪除</DialogTitle>
				<DialogContent>
					<DialogContentText id="delete-dialog-description">
						您確定要刪除文檔 &quot;{selectedDocument?.fileName}&quot; 嗎？此操作無法撤銷。
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCancelDelete} color="primary">
						取消
					</Button>
					<Button onClick={handleConfirmDelete} color="error" autoFocus>
						刪除
					</Button>
				</DialogActions>
			</Dialog>
		</Container>
	);
}

export default DocumentList;
