/**
 * 文檔類型定義
 */
export interface Document {
	id: string;
	fileName: string;
	fileType: string;
	createdAt: Date;
	createdBy: string;
	lastModifiedAt: Date;
	lastModifiedBy: null;
	isTemplate: boolean;
}

/**
 * 文檔詳情類型
 */
export interface DocumentDetails extends Document {
	content?: string;
}

/**
 * 創建文檔請求
 */
export interface CreateDocumentRequest {
	title: string;
	fileType: string;
}

/**
 * 更新文檔請求
 */
export interface UpdateDocumentRequest {
	id: string;
	title?: string;
}

/**
 * 文檔操作結果
 */
export interface DocumentActionResult {
	success: boolean;
	message?: string;
	document?: Document;
}

/**
 * OnlyOffice Document Editor 配置
 */
export interface DocumentEditorConfig {
	documentType?: string;
	height?: string;
	token?: string;
	type?: string;
	width?: string;
	document: {
		docId: string;
		fileType: string;
		key: string;
		referenceData?: {
			fileKey: string;
			instanceId: string;
			key: string;
		};
		title: string;
		url: string;
		info?: {
			owner?: string;
			uploaded?: string;
			favorite?: boolean;
			folder?: string;
			sharingSettings?: any[];
		};
		permissions?: {
			/**
			 * @deprecated Deprecated since version 5.5, please add the onRequestRestore field instead.
			 */
			changeHistory?: boolean;
			chat?: boolean;
			comment?: boolean;
			commentGroups?: any;
			copy?: boolean;
			deleteCommentAuthorOnly?: boolean;
			download?: boolean;
			edit?: boolean;
			editCommentAuthorOnly?: boolean;
			fillForms?: boolean;
			modifyContentControl?: boolean;
			modifyFilter?: boolean;
			print?: boolean;
			protect?: boolean;
			/**
			 * @deprecated Deprecated since version 6.0, please add the onRequestRename field instead.
			 */
			rename?: boolean;
			review?: boolean;
			reviewGroups?: string[];
			userInfoGroups?: string[];
		};
	};
	editorConfig: {
		actionLink?: any;
		callbackUrl?: string;
		coEditing?: {
			mode: string;
			change: boolean;
		};
		createUrl?: string;
		lang?: string;
		location?: string;
		mode?: string;
		recent?: any[];
		region?: string;
		templates?: any[];
		user?: {
			/**
			 * @deprecated Deprecated since version 4.2, please use name instead.
			 */
			firstname?: string;
			group?: string;
			id?: string;
			image?: string;
			/**
			 * @deprecated Deprecated since version 4.2, please use name instead.
			 */
			lastname?: string;
			name?: string;
		};
		customization?: {
			anonymous?: {
				request?: boolean;
				label?: string;
			};
			autosave?: boolean;
			/**
			 * @deprecated Deprecated since version 7.1, please use the document.permissions.chat parameter instead.
			 */
			chat?: boolean;
			/**
			 * @deprecated Deprecated since version 6.3, please use the document.permissions.editCommentAuthorOnly and document.permissions.deleteCommentAuthorOnly fields instead.
			 */
			commentAuthorOnly?: boolean;
			comments?: boolean;
			compactHeader?: boolean;
			compactToolbar?: boolean;
			compatibleFeatures?: boolean;
			customer?: {
				address?: string;
				info?: string;
				logo?: string;
				logoDark?: string;
				mail?: string;
				name?: string;
				phone?: string;
				www?: string;
			};
			features?: any;
			feedback?: any;
			forcesave?: boolean;
			goback?: any;
			help?: boolean;
			hideNotes?: boolean;
			hideRightMenu?: boolean;
			hideRulers?: boolean;
			integrationMode?: string;
			logo?: {
				image?: string;
				imageDark?: string;
				imageEmbedded?: string;
				url?: string;
			};
			macros?: boolean;
			macrosMode?: string;
			mentionShare?: boolean;
			mobileForceView?: boolean;
			plugins?: boolean;
			review?: {
				hideReviewDisplay?: boolean;
				hoverMode?: boolean;
				reviewDisplay?: string;
				showReviewChanges?: boolean;
				trackChanges?: boolean;
			};
			/**
			 * @deprecated Deprecated since version 7.0. Please use the review.reviewDisplay parameter instead.
			 */
			reviewDisplay?: string;
			/**
			 * @deprecated Deprecated since version 7.0. Please use the review.showReviewChanges parameter instead.
			 */
			showReviewChanges?: boolean;
			/**
			 * @deprecated Deprecated since version 7.1. Please use the features.spellcheck parameter instead.
			 */
			spellcheck?: boolean;
			submitForm?: boolean;
			toolbarHideFileName?: boolean;
			toolbarNoTabs?: boolean;
			/**
			 * @deprecated Deprecated since version 7.0. Please use the review.trackChanges parameter instead.
			 */
			trackChanges?: boolean;
			uiTheme?: string;
			unit?: string;
			zoom?: number;
		};
		embedded?: {
			embedUrl?: string;
			fullscreenUrl?: string;
			saveUrl?: string;
			shareUrl?: string;
			toolbarDocked?: string;
		};
		plugins?: {
			autostart?: string[];
			pluginsData?: string[];
			/**
			 * @deprecated Deprecated since version 4.3, please use the absolute URLs in pluginsData field.
			 */
			url?: string;
		};
	};
}

export interface DocumentConfig {
	// 根據實際需求添加相關屬性
	id: string;
	fileName: string;
	// ... 其他屬性
}

export interface DocumentError {
	code: number;
	description: string;
}

export type DocumentEventHandler = (eventName: string, event: any) => void;
export type DocumentErrorHandler = (errorCode: number, errorDescription: string) => void;
