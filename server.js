const express = require('express');
const app = express();


const redis = require('./redis-client');

app.use(express.json());

app.post('/orders/submit', async (req, res) => {
  // last order info for the order confirmation page
  const timestamp = Math.floor(new Date().getTime() / 1000);
  await redis.client.connect();
  await redis.client.incr('last_order_id');
  await redis.client.set('last_order_isbn', req.body.isbn);
  await redis.client.set('last_order_title', req.body.title);
  await redis.client.set('last_order_author', req.body.author);
  await redis.client.set('last_order_quantity', '' + req.body.quantity);
  await redis.client.set('last_order_timestamp', '' + timestamp);


  // cache the order itself
  // cached orders are strings of the format id;;isbn;;title;;author;;quantity;;timestamp
  const id = await redis.client.get('last_order_id');
  await redis.client.sendCommand([
    'ZADD',
    'orders',
    timestamp.toString(),
    `${id};;${req.body.isbn};;${req.body.title};;${req.body.author};;${req.body.quantity};;${timestamp}`
  ]);

  await redis.client.quit();

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
  const orderList = [];

  await redis.client.connect();
  const results = await redis.client.zRangeByScore('orders', 1, '+inf');

  for (const result of results) {
    const orderSplit = result.split(';;');
    orderList.push({
      id: orderSplit[0],
      isbn: orderSplit[1],
      title: orderSplit[2],
      author: orderSplit[3],
      quantity: parseInt(orderSplit[4]),
      timestamp: parseInt(orderSplit[5])
    })
  }

  await redis.client.quit();

  return res.json({
    orderList
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
