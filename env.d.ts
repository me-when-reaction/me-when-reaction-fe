declare namespace NodeJS {
  export interface ProcessEnv {
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_KEY: string;
    NEXT_PUBLIC_API_URL: string;

    DB_NAME: string;
    DB_HOST: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_PORT: number;
  }
}