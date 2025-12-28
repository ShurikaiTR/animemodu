import { z } from "zod";

export const profileSchema = z.object({
    username: z.string()
        .min(3, "Kullanıcı adı en az 3 karakter olmalıdır")
        .max(20, "Kullanıcı adı en fazla 20 karakter olmalıdır")
        .regex(/^[a-zA-Z0-9_]+$/, "Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir")
        .optional()
        .nullable(),
    full_name: z.string()
        .max(50, "İsim en fazla 50 karakter olmalıdır")
        .optional()
        .nullable(),
    bio: z.string()
        .max(250, "Biyografi en fazla 250 karakter olmalıdır")
        .optional()
        .nullable(),
    location: z.string()
        .max(100, "Konum en fazla 100 karakter olmalıdır")
        .optional()
        .nullable(),
    age: z.string()
        .max(5, "Yaş en fazla 5 karakter olmalıdır")
        .optional()
        .nullable(),
    avatar_url: z.union([z.string().url("Geçersiz avatar URL'si"), z.string().length(0)]).optional().nullable(),
    banner_url: z.union([z.string().url("Geçersiz banner URL'si"), z.string().length(0)]).optional().nullable(),
    social_media: z.record(z.string(), z.union([z.string().url(), z.string().length(0)])).optional().nullable(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export function validateProfile(data: unknown) {
    return profileSchema.safeParse(data);
}
