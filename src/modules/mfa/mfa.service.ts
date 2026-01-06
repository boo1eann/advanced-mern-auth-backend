import { Request } from 'express';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { BadRequestException, UnauthorizedException } from '../../common/utils/catch-errors';

export class MfaService {
	public async generateMFASetup(req: Request) {
		const user = req.user;

		if (!user) {
			throw new UnauthorizedException('User not authorized');
		}

		if (user.userPreference.enable2FA) {
			return {
				message: 'MFA already enabled',
			};
		}

		let secretKey = user.userPreference.twoFactorSecret;

		if (!secretKey) {
			const secret = speakeasy.generateSecret({ name: 'Squeezy' });
			secretKey = secret.base32;
			user.userPreference.twoFactorSecret = secretKey;
			await user.save();
		}

		const url = speakeasy.otpauthURL({
			secret: secretKey,
			label: `${user.name}`,
			issuer: 'squeezy.com',
			encoding: 'base32',
		});

		const qrImageUrl = await qrcode.toDataURL(url);

		return {
			message: 'Scan the QR code or use the setup key',
			secret: secretKey,
			qrImageUrl,
		};
	}

	public async verifyMFASetup(req: Request, code: string, secretKey: string) {
		const user = req.user;

		if (!user) {
			throw new UnauthorizedException('User not authorized');
		}

		if (user.userPreference.enable2FA) {
			return {
				message: 'MFA is already enabled',
				userPreferences: {
					enable2FA: user.userPreference.enable2FA,
				},
			};
		}

		const isValid = speakeasy.totp.verify({
			secret: secretKey,
			encoding: 'base32',
			token: code,
		});

		if (!isValid) {
			throw new BadRequestException('Invalid MFA code. Please try again.');
		}

		user.userPreference.enable2FA = true;
		await user.save();

		return {
			message: 'MFA setup completed successfully',
			userPreferences: {
				enable2FA: user.userPreference.enable2FA,
			},
		};
	}
}
