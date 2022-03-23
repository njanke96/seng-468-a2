const express = require('express');
const app = express();


const redis = require('./redis-client');

app.get('/', (req, res) => {
  return res.redirect(301, '/index.html')
});

// everything in /public should just be served
app.use(express.static('public'))

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
