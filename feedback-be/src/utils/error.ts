export class CustomError extends Error {
	public status: number;
	public message: string;
	public data?: any | null;

	constructor({ message, status, data }: { status: number; message: string; data?: any }) {
		super(message);
		this.message = message;
		this.status = status;
		this.data = data;
	}
}
