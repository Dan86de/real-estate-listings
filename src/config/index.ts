export default () => ({
  environment: process.env.NODE_ENV || 'development',
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
  },
  gcp: {
    projectId: process.env.GCP_PROJECT_ID,
    privateKey: process.env.GCP_PRIVATE_KEY
      ? process.env.GCP_PRIVATE_KEY.replace(/\\n/g, '\n')
      : null,
    clientEmail: process.env.GCP_CLIENT_EMAIL,
    buckets: { listingImages: process.env.GCP_LISTING_BUCKET },
  },
});
