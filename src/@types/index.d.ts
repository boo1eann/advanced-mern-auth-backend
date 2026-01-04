import { UserDocument } from '../database/models/user.model';

declare global {
	namespace Express {
		interface User extends UserDocument {
			id: string;
		}
		interface Request {
			sessionId?: string;
		}
	}
}
