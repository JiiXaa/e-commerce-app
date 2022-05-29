const express = require('express');
const cookieSession = require('cookie-session');

const usersRepo = require('./repositories/users');

const PORT = 5000;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    keys: ['!432$5432!!322'],
  })
);

app.get('/signup', (req, res) => {
  res.send(`
  <div>
    Your id is: ${req.session.userId}
    <form method="POST">
      <input name="email" placeholder="email"/>
      <input type="password" name="password" placeholder="password"/>
      <input type="password" name="passwordConfirmation" placeholder="confirm password"/>
      <button>Sign Up</button>
    </form>
  </div>
  `);
});

app.post('/signup', async (req, res) => {
  const { email, password, passwordConfirmation } = req.body;

  const existingUser = await usersRepo.getOneBy({ email });
  if (existingUser) {
    return res.send('Email in use');
  }

  if (password !== passwordConfirmation) {
    return res.send('Password must match!');
  }

  // Create a user in our user repo to represent this person
  // / create method returns object with user email, password and create an id.
  const user = await usersRepo.create({ email, password });

  // Store the id of that user inside the users cookie
  // / req.session is an {} added by cookie-session and we can add anything to it.
  // / we creating userId and assign param with user.id created by UsersRepo.create()
  req.session.userId = user.id;

  res.send('Account created!');
});

app.get('/signout', (req, res) => {
  req.session = null;
  res.send('You are logged out');
});

app.get('/signin', (req, res) => {
  res.send(`
  <div>
    <form method="POST">
      <input name="email" placeholder="email"/>
      <input type="password" name="password" placeholder="password"/>
      <button>Sign In</button>
    </form>
  </div>
  `);
});

app.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  const user = await usersRepo.getOneBy({ email });

  if (!user) {
    return res.send('Email not found');
  }

  const validPassword = await usersRepo.comparePasswords(
    user.password,
    password
  );

  if (!validPassword) {
    return res.send('Invalid password');
  }

  req.session.userId = user.id;

  res.send('You are signed in!');
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
