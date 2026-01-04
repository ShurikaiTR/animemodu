/**
 * Site ayarları ile ilgili server action'lar.
 * 150 satır kuralı gereği parçalara ayrılmıştır.
 * 
 * NOT: Bu dosya barrel export dosyasıdır.
 * "use server" direktifi kullanılmaz çünkü Next.js
 * sadece doğrudan tanımlanan async fonksiyonlara izin verir.
 * Alt modüller (fetch.ts, mutate.ts) kendi direktiflerini içerir.
 */

export {
    getAllSettings,
    getSettingsByCategory,
    getSiteInfo,
    getSettingByKey
} from "./fetch";

export {
    updateSetting,
    updateSiteInfo
} from "./mutate";
