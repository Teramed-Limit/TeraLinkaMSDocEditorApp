import * as signalR from '@microsoft/signalr';
import { HubConnectionState } from '@microsoft/signalr';

class SignalRService {
	private connection: signalR.HubConnection;
	private static instance: SignalRService;
	private reconnectTimeout?: NodeJS.Timeout;

	private constructor() {
		this.connection = new signalR.HubConnectionBuilder()
			.withUrl('http://localhost:5292/documentHub')
			.withAutomaticReconnect()
			.build();
	}

	public static getInstance(): SignalRService {
		if (!SignalRService.instance) {
			SignalRService.instance = new SignalRService();
		}
		return SignalRService.instance;
	}

	public async startConnection(): Promise<void> {
		try {
			// 檢查連接狀態
			if (this.connection.state === HubConnectionState.Connected) {
				return;
			}

			if (this.connection.state === HubConnectionState.Connecting) {
				return;
			}

			if (this.reconnectTimeout) {
				clearTimeout(this.reconnectTimeout);
			}

			await this.connection.start();
			// eslint-disable-next-line no-console
			console.log('SignalR Connected.');
		} catch (err) {
			// eslint-disable-next-line no-console
			console.error('SignalR Connection Error: ', err);
			this.reconnectTimeout = setTimeout(() => this.startConnection(), 5000);
		}
	}

	public onSaveStatus(callback: (documentId: string, status: string) => void): void {
		this.connection.on('ReceiveSaveStatus', callback);
	}

	public offSaveStatus(callback: (documentId: string, status: string) => void): void {
		this.connection.off('ReceiveSaveStatus', callback);
	}

	public getConnection(): signalR.HubConnection {
		return this.connection;
	}

	public disconnect(): void {
		if (this.reconnectTimeout) {
			clearTimeout(this.reconnectTimeout);
		}
		if (this.connection.state !== HubConnectionState.Disconnected) {
			this.connection.stop();
		}
	}
}

export default SignalRService;
