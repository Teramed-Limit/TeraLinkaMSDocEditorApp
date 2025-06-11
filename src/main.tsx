import { StrictMode } from 'react';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import axios from 'axios';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App.tsx';
import './index.css';
// 引入 i18n 實例
import { globalStore } from './config/global-store.ts';
import './locales/i18n.ts';

export const fetchAppConfig = async (): Promise<void> => {
	try {
		const response = await axios.get('/config.json');
		const environment = response.data;
		globalStore.IP_ADDRESS = environment.IP_ADDRESS;
		globalStore.SIGNALR_ADDRESS = environment.SIGNALR_ADDRESS;
	} catch (error) {
		console.error('Error fetching config:', error);
	}
};

fetchAppConfig().then(() => {
	createRoot(document.getElementById('root')!).render(
		<StrictMode>
			<BrowserRouter basename="/">
				<App />
			</BrowserRouter>
		</StrictMode>,
	);
});
