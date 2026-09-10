import grader from './lib/grade-debugging.cjs';
export default request => grader.handleGrade(request);
export const config = {path:'/api/grade-debugging',rateLimit:{windowLimit:30,windowSize:60,aggregateBy:['ip','domain'],action:'rate_limit'}};
