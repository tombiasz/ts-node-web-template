import createHelloHandler from './hello';
import createHealthHandler from './health';
import createErrorsHandler from './errors';

export const helloHandler = createHelloHandler('fizz buzz');
export const healthHandler = createHealthHandler();
export const errorsHandler = createErrorsHandler();
