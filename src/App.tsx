import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Navigate, Route, Routes } from 'react-router-dom';

import './App.css';
import { queryClient } from './api/query-client';
import DocumentEditorPage from './component/document/DocumentEditor';
import DocumentSelectTemplateEditorPage from './component/document/DocumentSelectTemplateEditor';
import { MainLayout } from './layout/MainLayout';
import './locales/i18n';
import DocumentPage from './pages/DocumentPage/DocumentPage';
import DocumentTemplatePage from './pages/DocumentTemplatePage/DocumentTemplatePage';

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<ReactQueryDevtools initialIsOpen={false} />

			<Routes>
				{/* 首頁重定向到文檔列表 */}
				<Route path="/" element={<Navigate to="/documents" replace />} />

				{/* 主要布局路由 */}
				<Route element={<MainLayout />}>
					<Route path="/documents" element={<DocumentPage />} />
					<Route path="/documentTemplate" element={<DocumentTemplatePage />} />
				</Route>

				{/* 文檔編輯器路由 */}
				<Route path="/document/:id/new" element={<DocumentSelectTemplateEditorPage />} />

				{/* 文檔編輯器路由 */}
				<Route path="/document/:id/:mode" element={<DocumentEditorPage />} />

				{/* 404 頁面 - 重定向到文檔列表 */}
				{/* <Route path="*" element={<Navigate to="/documents" replace />} /> */}
			</Routes>
		</QueryClientProvider>
	);
}

export default App;
