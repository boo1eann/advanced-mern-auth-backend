import { z } from 'zod';
import validator from 'validator';

export const emailSchema = z
	.string()
	.trim()
	.refine((val) => validator.isEmail(val), { error: 'Invalid email address' })
	.min(1)
	.max(255);

export const passwordSchema = z.string().trim().min(6).max(255);
export const verificationCodeSchema = z.string().trim().min(1).max(25);

export const registerSchema = z
	.object({
		name: z.string().trim().min(1).max(255),
		email: emailSchema,
		password: passwordSchema,
		confirmPassword: passwordSchema,
	})
	.refine((val) => val.password === val.confirmPassword, {
		error: 'Password does not match',
		path: ['confirmPassword'],
	});

export const loginSchema = z.object({
	email: emailSchema,
	password: passwordSchema,
	userAgent: z.string().optional(),
});

export const verificationEmailSchema = z.object({
	code: verificationCodeSchema,
});

export const resetPasswordSchema = z.object({
	password: passwordSchema,
	verificationCode: verificationCodeSchema,
});
