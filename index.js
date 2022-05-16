const express = require('express');
const PORT = 5000;

const app = express();

app.get('/', (req, res) => {
  res.send(`
  <div>
    <form method="POST">
      <input name="email" placeholder="email"/>
      <input type="password" name="password" placeholder="password"/>
      <input type="password" name="passwordConfirmation" placeholder="confirm password"/>
      <button>Sign Up</button>
    </form>
  </div>
  `);
});

app.post('/', (req, res) => {
  req.on('data', (data) => {
    const parsed = data.toString('utf8').split('&');
    const formData = {};
    for (let pair of parsed) {
      const [key, value] = pair.split('=');
      formData[key] = value;
    }
    console.log(formData);
  });
  res.send('Account created! ');
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
