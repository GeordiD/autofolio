import 'dotenv/config';
import { initServer } from './server/initServer';
import { schwabOauthService } from '@/services/schwab/schwabOauthService';

initServer();

console.log('Click to connect');
console.log(schwabOauthService.buildUrl());
