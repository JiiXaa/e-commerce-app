const express = require('express');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');

const PORT = 5000;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    keys: ['!432$5432!!322'],
  })
);

app.use(authRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
