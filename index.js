const express = require('express');
const PORT = 5000;

const app = express();

app.use(express.urlencoded({ extended: true }));

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
  console.log(req.body);
  res.send('Account created!');
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
