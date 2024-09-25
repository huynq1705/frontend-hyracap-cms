// src/env.d.ts

interface ImportMetaEnv {
  readonly VITE_APP_BASE_API_URL: string;
  readonly VITE_APP_PREFIX_URL_IMAGE: string;
  // Thêm các biến môi trường khác nếu cần
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
