import { z } from 'zod';

const envSchema = z.object({
  API_KEY: z.string(),
  AUTH_DOMAIN: z.string(),
  PROJECT_ID: z.string(),
  STORAGE_BUCKET: z.string(),
  MESSAGING_SENDER_ID: z.string(),
  APP_ID: z.string(),
  MEASUREMENT_ID: z.string(),
  DATABASE_URL: z.url(),
});

const _clientEnv = {
  API_KEY: process.env.EXPO_PUBLIC_API_KEY,
  AUTH_DOMAIN: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  PROJECT_ID: process.env.EXPO_PUBLIC_PROJECT_ID,
  STORAGE_BUCKET: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  MESSAGING_SENDER_ID: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  APP_ID: process.env.EXPO_PUBLIC_APP_ID,
  MEASUREMENT_ID: process.env.EXPO_PUBLIC_MEASUREMENT_ID,
  DATABASE_URL: process.env.EXPO_PUBLIC_DATABASE_URL,
};

const parsed = envSchema.safeParse(_clientEnv);

if (parsed.success === false) {
  // eslint-disable-next-line no-console
  console.error(
    '❌ Invalid environment variables:',
    z.treeifyError(parsed.error),

    `\n❌ Missing variables in .env file, Make sure all required variables are defined in the .env file.`
  );
  throw new Error('Invalid environment variables, Check terminal for more details ');
}

export const envWeb = parsed.data;
