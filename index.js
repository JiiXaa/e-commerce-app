const express = require('express');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');
const adminProductsRouter = require('./routes/admin/products');
const productsRouter = require('./routes/products');

const PORT = 5000;

const app = express();

// / middlewares
// finds the public folder and make it available from the outside
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    keys: ['!432$5432!!322'],
  })
);

// / routes
app.use(authRouter);
app.use(adminProductsRouter);
app.use(productsRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
