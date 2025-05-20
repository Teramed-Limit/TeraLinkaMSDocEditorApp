import { useEffect, useState } from 'react';

import { Box, Tab, Tabs } from '@mui/material';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

// 定義頁面路徑和標籤的映射
const tabsConfig = [
	{ path: '/documents', label: '文件管理' },
	{ path: '/documentTemplate', label: '文件範本' },
];

export function MainLayout() {
	const location = useLocation();
	const navigate = useNavigate();
	const [currentTab, setCurrentTab] = useState(0);

	// 根據當前路徑更新選中的標籤
	useEffect(() => {
		const tabIndex = tabsConfig.findIndex((tab) => location.pathname === tab.path);
		if (tabIndex !== -1) {
			setCurrentTab(tabIndex);
		}
	}, [location.pathname]);

	// 處理標籤切換
	const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
		setCurrentTab(newValue);
		navigate(tabsConfig[newValue].path);
	};

	return (
		<Box sx={{ width: '100%' }}>
			<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
				<Tabs value={currentTab} onChange={handleTabChange}>
					{tabsConfig.map((tab) => (
						<Tab key={tab.path} label={tab.label} />
					))}
				</Tabs>
			</Box>
			<Box sx={{ p: 3 }}>
				<Outlet />
			</Box>
		</Box>
	);
}
