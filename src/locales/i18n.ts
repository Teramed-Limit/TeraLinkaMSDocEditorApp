import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

// 移除原本的 fetchLocale 異步函數，改用 Backend 載入資源
i18n.use(Backend)
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		fallbackLng: 'ENG',
		lng: 'ENG',
		interpolation: {
			escapeValue: false,
		},
		backend: {
			loadPath: '/locales/{{lng}}/{{ns}}.json',
		},
		debug: process.env.NODE_ENV === 'development',
	});

export default i18n;
