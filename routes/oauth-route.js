import OAuthClient from 'intuit-oauth';
import bodyParser from 'body-parser';
import express from 'express';
import dotenv from 'dotenv';
import { setClient, getClient } from '../services/auth-service.js';

dotenv.config();

const router = express.Router();

let oauthClient = null;
let token = null;

const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/login', urlencodedParser, function (req, res) {
  oauthClient = new OAuthClient({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      environment: process.env.ENVIRONMENT,
      redirectUri: process.env.REDIRECT_URI,
      logging: true,
  });

  const authUri = oauthClient.authorizeUri({
    scope: [
      OAuthClient.scopes.Accounting,
      OAuthClient.scopes.OpenId,
      'payroll.compensation.read'
    ],
  });
  req.oauthClient = oauthClient;
  res.json({redirectUrl: authUri});
});

router.get('/callback', async function (req, res) {
  const authResponse = await oauthClient.createToken(req.url);
  console.log(req.url,"eq.url")
  setClient(oauthClient);
  token = authResponse.json.access_token;
  console.log(token)
  res.redirect('/');
});

router.post('/retrieveToken', function (req, res) {
    res.json({token: (getClient()?.getToken()?.getToken())});
});

export default router;