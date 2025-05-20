import { Box, CircularProgress, Typography } from '@mui/material';

import { useDocumentsQuery } from '../../api/queries';
import DocumentList from '../../component/document/DocumentList';

function DocumentPage() {
	const { data, isLoading, isError, refetch } = useDocumentsQuery();

	if (isLoading) {
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
				<CircularProgress />
			</Box>
		);
	}

	if (isError) {
		return (
			<Box sx={{ textAlign: 'center', my: 5 }}>
				<Typography color="error">載入文檔列表時發生錯誤。請稍後再試。</Typography>
			</Box>
		);
	}

	if (!data) {
		return (
			<Box sx={{ textAlign: 'center', my: 5 }}>
				<Typography variant="h6">暫無文檔</Typography>
				<Typography variant="body2" color="textSecondary">
					請新增您的第一個文檔
				</Typography>
			</Box>
		);
	}

	return <DocumentList title="我的文檔" documentList={data.filter((x) => !x.isTemplate)} handleQueryDoc={refetch} />;
}

export default DocumentPage;
