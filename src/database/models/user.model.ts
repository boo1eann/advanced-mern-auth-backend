import mongoose, { Document, Schema } from 'mongoose';
import { compareValue, hashValue } from '../../common/utils/bcrypt';

interface UserPreferences {
	enable2FA: boolean;
	emailNotification: boolean;
	twoFactorSecret?: string;
}

export interface UserDocument extends Document {
	name: string;
	email: string;
	password: string;
	isEmailVerified: boolean;
	createdAt: Date;
	updatedAt: Date;
	userPreference: UserPreferences;
	comparePassword(value: string): Promise<boolean>;
}

const userPreferencesSchema = new Schema<UserPreferences>({
	enable2FA: { type: Boolean, default: false },
	emailNotification: { type: Boolean, default: true },
	twoFactorSecret: { type: String, required: false },
});

const userSchema = new Schema<UserDocument>(
	{
		name: { type: String, required: true },
		email: { type: String, unique: true, required: true },
		password: { type: String, required: true },
		isEmailVerified: {
			type: Boolean,
			default: false,
		},
		userPreference: {
			type: userPreferencesSchema,
			default: {},
		},
	},
	{
		timestamps: true,
		toJSON: {},
	},
);

userSchema.pre('save', async function () {
	if (this.isModified('password')) {
		this.password = await hashValue(this.password);
	}
});

userSchema.methods.comparePassword = async function (value: string): Promise<boolean> {
	return compareValue(value, this.password);
};

userSchema.set('toJSON', {
	transform: function (doc, ret) {
		const { password, userPreference: up = {}, ...rest } = ret;

		// говорим TypeScript, что up — это UserPreference
		const userPreferences = up as UserPreferences;

		const { twoFactorSecret, ...safeUserPreferences } = userPreferences;

		return {
			...rest,
			userPreferences: safeUserPreferences,
		};
	},
});

const UserModel = mongoose.model<UserDocument>('User', userSchema);
export default UserModel;
