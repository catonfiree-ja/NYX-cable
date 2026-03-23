const https = require('https');

const data = JSON.stringify({
  mutations: [{
    patch: {
      id: 'gallery-delivery-2025',
      set: {
        title: '\u0e2a\u0e48\u0e07\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32 2026'
      }
    }
  }]
});

const options = {
  hostname: '30wikoy9.api.sanity.io',
  path: '/v2024-01-01/data/mutate/production',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer sk53VR1KBUCe8pVqCKfQM4qRoELeLQnc9TRVy1vSEZIQTohrvagv2Gw95EXx9Viua8uu0wBal7UxTwQV07fo1hFn8rrLph7eePHwoNnXxoandZwQONOqfOTM9V4GJbDxjuahLebq4lJg9SuOkYua592MBbIcgTx6anwiL77kWeGjdyj6bHJP'
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => console.log('Response:', body));
});
req.on('error', (e) => console.error('Error:', e));
req.write(data);
req.end();
