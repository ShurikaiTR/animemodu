import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { logError } from "@/shared/lib/errors";

const _UPLOADS_DIR = join(process.cwd(), "public", "uploads");

/**
 * Dosyayı lokal dosya sistemine kaydeder
 */
export async function saveFileLocally(
    file: File,
    fileName: string,
    subDir: string = "uploads"
): Promise<{ success: boolean; path?: string; error?: string }> {
    try {
        const targetDir = join(process.cwd(), "public", subDir);

        // Klasörün varlığından emin ol
        await mkdir(targetDir, { recursive: true });

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const filePath = join(targetDir, fileName);
        await writeFile(filePath, buffer);

        // Browser'dan erişilebilir public yolu döndür
        return { success: true, path: `/${subDir}/${fileName}` };
    } catch (error) {
        logError("saveFileLocally", error);
        return { success: false, error: "Dosya kaydedilirken bir hata oluştu." };
    }
}
