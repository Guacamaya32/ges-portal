const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

const CONFIG = {
  tenantId:     'fc8bd45f-5351-4081-8eca-55ef07ba2c6b',
  clientId:     '6064a487-804b-4f43-ba6a-9c3c5900b036',
  clientSecret: 'Rpm8Q~RXOTRyU33lbQelQQ4FiEfZsn9hlpbkMcCn',
  envUrl:       'https://defaultfc8bd45f535140818eca55ef07ba2c.6b.environment.api.powerplatform.com'
};

// ── Obtener token ──
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

// ── GET tickets ──
app.get('/api/tickets', async (req, res) => {
  try {
    const token = await getToken();
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
    res.json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// ── GET contratos ──
app.get('/api/contratos', async (req, res) => {
  try {
    const token = await getToken();
    const response = await fetch(
      `${CONFIG.envUrl}/api/data/v9.2/ge_contratoses?$top=50`,
      {
        headers: {
          'Authorization':    `Bearer ${token}`,
          'Content-Type':
