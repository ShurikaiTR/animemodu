"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { safeAction } from "@/shared/lib/actions/wrapper";

import { ForgotPasswordSchema, LoginSchema, RegisterSchema } from "../schemas/auth-schemas";
import { AuthService } from "../services/auth-service";

// ... imports ...

// Removed ActionResponse in favor of ActionResult

export async function loginAction(prevState: unknown, formData: FormData) {
    return await safeAction(async () => {
        const rawData = Object.fromEntries(formData);
        const validation = LoginSchema.safeParse(rawData);

        if (!validation.success) {
            throw new Error(validation.error.issues[0].message);
        }

        const result = await AuthService.login(validation.data);
        if (!result.success) {
            throw new Error(result.error);
        }

        revalidatePath("/");
    }, "loginAction");
}

export async function registerAction(prevState: unknown, formData: FormData) {
    return await safeAction(async () => {
        const rawData = Object.fromEntries(formData);
        const validation = RegisterSchema.safeParse(rawData);

        if (!validation.success) {
            throw new Error(validation.error.issues[0].message);
        }

        const headersList = await headers();
        const origin = headersList.get("origin");
        const callbackUrl = `${origin}/auth/callback`;

        const result = await AuthService.register(validation.data, callbackUrl);
        if (!result.success) {
            throw new Error(result.error);
        }

        return { message: "Kayıt başarılı! Email adresinizi kontrol edin." };
    }, "registerAction");
}

export async function forgotPasswordAction(prevState: unknown, formData: FormData) {
    return await safeAction(async () => {
        const rawData = Object.fromEntries(formData);
        const validation = ForgotPasswordSchema.safeParse(rawData);

        if (!validation.success) {
            throw new Error(validation.error.issues[0].message);
        }

        const headersList = await headers();
        const origin = headersList.get("origin");
        const resetUrl = `${origin}/auth/reset-password`;

        const result = await AuthService.resetPassword(validation.data, resetUrl);
        if (!result.success) {
            throw new Error(result.error);
        }

        return { message: "Şifre sıfırlama linki email adresinize gönderildi." };
    }, "forgotPasswordAction");
}
