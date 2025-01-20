export const setupLogger = (env: 'development' | 'production') => {
  const envToLogger = {
    development: {
      transport: {
        target: 'pino-pretty',
        optoins: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      },
    },
    production: false,
  };

  return envToLogger[env];
};
