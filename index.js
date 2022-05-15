const express = require('express');
const PORT = 5000;

const app = express();

app.get('/', (req, res) => {
  res.send(' Response Testing');
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
