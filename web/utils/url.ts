const {
  NEXT_PUBLIC_VERCEL_ENV = 'development',
  NEXT_PUBLIC_VERCEL_BRANCH_URL,
  NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL,
} = process.env;

export function getBaseURL() {
  switch (NEXT_PUBLIC_VERCEL_ENV) {
    case 'development':
      return 'http://localhost:3000';
    case 'production':
      return `https://${NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`;
    default:
      return `https://${NEXT_PUBLIC_VERCEL_BRANCH_URL}`;
  }
}
