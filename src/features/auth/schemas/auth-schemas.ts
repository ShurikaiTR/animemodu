import { z } from "zod";

export const LoginSchema = z.object({
    email: z.string().email("Geçerli bir email adresi giriniz"),
    password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
});

export const RegisterSchema = z.object({
    email: z.string().email("Geçerli bir email adresi giriniz"),
    password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
    username: z.string().min(3, "Kullanıcı adı en az 3 karakter olmalıdır"),
});

export const ForgotPasswordSchema = z.object({
    email: z.string().email("Geçerli bir email adresi giriniz"),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
