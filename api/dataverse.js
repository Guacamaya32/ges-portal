const fetch = require('node-fetch');

const CONFIG = {
  tenantId:     process.env.TENANT_ID,
  clientId:     process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  envUrl:       process.env.ENV_URL
};

async function getToken() {
  const res = await fetch(
    `https://login.microsoftonline.com/${CONFIG.tenantId}/oauth2/v2.0/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type:    'client_credentials',
        client_id:     CONFIG.clientId,
        client_secret: CONFIG.clientSecret,
        scope:         `${CONFIG.envUrl}/.default`
      })
    }
  );
  const data = await res.json();
  return data.access_token;
}

module.exports = { CONFIG, getToken };
