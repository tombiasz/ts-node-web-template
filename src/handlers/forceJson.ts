import bodyParser from 'body-parser';

export function createForceJSONMiddleware() {
  return bodyParser.json({
      type: () => true,
  });
}
