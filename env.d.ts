declare namespace NodeJS {
  export interface ProcessEnv {
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_KEY: string;
    NEXT_PUBLIC_API_URL: string;

    /** Connection String ke DB. Kita pakai Drizzle */
    DATABASE_CONNECTION: string;

    /**
     * Native: Pakai filesys sendiri
     */
    STORAGE_TYPE: "Native" | "Supabase";
    STORAGE_NATIVE_PATH: string;
    STORAGE_NATIVE_UPLOAD_PATH: string;
    
    STORAGE_SUPABASE_ID: string;
    STORAGE_SUPABASE_SECRET: string;
    STORAGE_SUPABASE_ENDPOINT: string;
    STORAGE_SUPABASE_BUCKET: string;
    SUPABASE_SECRET_KEY: string;
  }
}