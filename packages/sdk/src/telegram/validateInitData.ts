// implements WebApp.initData validation from:
// https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
import crypto from 'crypto';

type WebAppChat = unknown;

type WebAppUser = {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  language_code: string;
  allows_write_to_pm: boolean;
};

interface WebAppInitData {
  query_id?: string;
  user?: WebAppUser;
  receiver?: WebAppUser;
  chat?: WebAppChat;
  chat_type?: 'sender' | 'private' | 'group' | 'supergroup' | 'channel';
  chat_instance?: string;
  start_param?: string;
  can_send_after?: number;
  auth_date?: number;
  hash: string;
}

function parseDataObj(dataObj: any): WebAppInitData {
  const parsedData: any = { ...dataObj };
  Object.keys(parsedData).forEach((key) => {
    switch (key) {
      case 'auth_date':
      case 'can_send_after':
        parsedData[key] = Number(parsedData[key]);
        break;
      case 'user':
      case 'receiver':
      case 'chat':
        parsedData[key] = JSON.parse(parsedData[key]);
        break;

      // No default case needed, leave as string
    }
  });
  return parsedData as WebAppInitData;
}

export function validateAndParseInitData(
  token: string,
  initData: string,
  maxAgeMs?: number
): WebAppInitData {
  const params = new URLSearchParams(initData);
  const dataObj: any = {};
  params.forEach((value, key) => {
    dataObj[key] = value;
  });

  // Validation steps described here
  // https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
  const receivedHash = dataObj.hash;
  delete dataObj.hash;

  const sortedKeys = Object.keys(dataObj).sort();
  const dataCheckString = sortedKeys
    .map((key) => `${key}=${dataObj[key]}`)
    .join('\n');

  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(token)
    .digest();

  const calculatedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  if (calculatedHash !== receivedHash) {
    throw new Error('Invalid data received.');
  }

  // Optionally check auth_date
  if (maxAgeMs !== undefined) {
    const authDateMs = Number(dataObj.auth_date) * 1000;
    const now = Date.now();
    if (authDateMs + maxAgeMs < now) {
      throw new Error('Data is too old.');
    }
  }

  return parseDataObj(dataObj);
}
