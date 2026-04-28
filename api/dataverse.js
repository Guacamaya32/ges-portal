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

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const token = await getToken();

    if (req.method === 'GET') {
      const response = await fetch(
        `${CONFIG.envUrl}/api/data/v9.2/cr7c5_tablaservicetickets?$top=50`,
        {
          headers: {
            'Authorization':    `Bearer ${token}`,
            'Content-Type':     'application/json',
            'Accept':           'application/json',
            'OData-MaxVersion': '4.0',
            'OData-Version':    '4.0'
          }
        }
      );
      const data = await response.json();
      return res.json(data);
    }

    if (req.method === 'POST') {
      const response = await fetch(
        `${CONFIG.envUrl}/api/data/v9.2/cr7c5_tablaservicetickets`,
        {
          method: 'POST',
          headers: {
            'Authorization':    `Bearer ${token}`,
            'Content-Type':     'application/json',
            'Accept':           'application/json',
            'OData-MaxVersion': '4.0',
            'OData-Version':    '4.0'
          },
          body: JSON.stringify(req.body)
        }
      );
      return res.json({ success: true, status: response.status });
    }

    if (req.method === 'PATCH') {
      const { id } = req.query;
      const response = await fetch(
        `${CONFIG.envUrl}/api/data/v9.2/cr7c5_tablaservicetickets(${id})`,
        {
          method: 'PATCH',
          headers: {
            'Authorization':    `Bearer ${token}`,
            'Content-Type':     'application/json',
            'Accept':           'application/json',
            'OData-MaxVersion': '4.0',
            'OData-Version':    '4.0'
          },
          body: JSON.stringify(req.body)
        }
      );
      return res.json({ success: true, status: response.status });
    }

  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
};
