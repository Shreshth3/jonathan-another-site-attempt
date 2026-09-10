import aiHelp from './lib/ai-help.cjs';

export default request => aiHelp.handleAiHelp(request);

export const config = {
  path: '/api/ai-help',
  rateLimit: { windowLimit: 20, windowSize: 60, aggregateBy: ['ip', 'domain'], action: 'rate_limit' }
};
