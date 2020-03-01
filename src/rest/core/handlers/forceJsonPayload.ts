import bodyParser from 'body-parser';

export function createForceJSONPayloadHandler() {
  return bodyParser.json({
      type: () => true,
  });
}
