type NavigateFunction = (path: string) => void;

/**
 * 導航服務類別，用於處理應用程式的導航邏輯
 */
export class NavigationService {
	private static navigator: NavigateFunction | null = null;

	/**
	 * 設置導航函數
	 * @param navigate - React Router 的 navigate 函數
	 */
	public static setNavigator(navigate: NavigateFunction) {
		this.navigator = navigate;
	}

	/**
	 * 執行導航
	 * @param path - 目標路徑
	 */
	public static navigate(path: string) {
		if (this.navigator) {
			this.navigator(path);
		} else {
			console.warn('Navigator not set, falling back to window.location');
			window.location.href = path;
		}
	}
}
