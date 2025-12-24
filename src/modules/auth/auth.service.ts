import { RegisterDto } from '../../common/interface/auth.interface';

export class AuthService {
	public async register(registerData: RegisterDto) {
		const { name, email, password, userAgent } = registerData;

		// const existingUser = await UserModel
	}
}
