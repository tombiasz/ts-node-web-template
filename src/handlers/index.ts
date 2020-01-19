import createHelloHandler from './hello';
import createHealthHandler from './health';

export const helloHandler = createHelloHandler('fizz buzz');
export const healthHandler = createHealthHandler();
