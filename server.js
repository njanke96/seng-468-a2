const express = require('express');
const app = express();


const redis = require('./redis-client');

app.use(express.json());

app.post('/orders/submit', async (req, res) => {
  // last order info for the order confirmation page
  await redis.client.connect();
  await redis.client.incr('last_order_id');
  await redis.client.set('last_order_isbn', req.body.isbn);
  await redis.client.set('last_order_title', req.body.title);
  await redis.client.set('last_order_author', req.body.author);
  await redis.client.set('last_order_quantity', '' + req.body.quantity);
  await redis.client.set('last_order_timestamp', '' + Math.floor(new Date().getTime() / 1000));
  await redis.client.quit();

  // TODO: cache the order itself

  return res.json({'success': true})
});

app.get('/orders/last', async (req, res) => {
  // retrieve last order info for the order confirmation page
  await redis.client.connect();
  const id = await redis.client.get('last_order_id');
  const isbn = await redis.client.get('last_order_isbn');
  const title = await redis.client.get('last_order_title');
  const author = await redis.client.get('last_order_author');
  const quantity = parseInt(await redis.client.get('last_order_quantity'));
  const timestamp = parseInt(await redis.client.get('last_order_timestamp'));
  await redis.client.quit();

  return res.json({
    id, isbn, title, author, quantity, timestamp
  })
});

app.get('/orders/history', async (req, res) => {
  return res.json({
    orderList: []
  })
});

app.get('/', (req, res) => {
  return res.redirect(301, '/index.html')
});

// everything in /public should just be served
app.use(express.static('public'))

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
