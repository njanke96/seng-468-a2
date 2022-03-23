const express = require('express');
const app = express();


const redis = require('./redis-client');

app.get('/', (req, res) => {
  return res.send('Hello world');
});

// everything in /public should just be served


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
