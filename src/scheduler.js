import cron from 'node-cron';
import config, { refreshTokenJob } from './dependencies.js';

const { deleteExpiredTokens } = config.get('cronJobs');

cron.schedule(
  deleteExpiredTokens.expression,
  () => refreshTokenJob.deleteExpiredTokens(),
  deleteExpiredTokens.options,
);
