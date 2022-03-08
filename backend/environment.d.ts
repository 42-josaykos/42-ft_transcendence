declare namespace NodeJS {
  export interface ProcessEnv {
    ENVIRONMENT: Environment;
    FT_CLIENT_ID?: string;
    FT_CLIENT_SECRET?: string;
    FT_CALLBACK_URL?: string;
  }
  export type Environment = 'DEVELOPMENT' | 'PRODUCTION';
}
