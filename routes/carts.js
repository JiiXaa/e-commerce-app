const express = require('express');
const cartsRepo = require('../repositories/carts');
const productsRepo = require('../repositories/products');
const cartShowTemplate = require('../views/carts/show');

const router = express.Router();

// Receive a POST request to add an item to a cart
router.post('/cart/products', async (req, res) => {
  // Figure out if user has cart
  // req.session is managed by cookie session
  let cart; // we create variable out of scope of if statement so its not scoped to the if block
  if (!req.session.cartId) {
    // User does not have a cart, we need to create one, and store the cart id on the req.session.cartId property
    cart = await cartsRepo.create({ items: [] });
    req.session.cartId = cart.id;
  } else {
    // User have a cart already, Let's get it from the repository
    cart = await cartsRepo.getOne(req.session.cartId);
  }
  // Either increment quantity for existing product
  // OR add new product to items array

  console.log(cart);
  const existingProduct = cart.items.find(
    (item) => item.id === req.body.productId
  );

  if (existingProduct) {
    // increment quantity and save cart
    existingProduct.quantity++;
  } else {
    // add new product id to items array
    cart.items.push({ id: req.body.productId, quantity: 1 });
  }

  await cartsRepo.update(cart.id, {
    items: cart.items,
  });

  res.redirect('/cart');
});

// Receive a GET request to show all items in cart
router.get('/cart', async (req, res) => {
  // cart is being created by adding first item, in case if cart is not yet created and user visit this route without assigned one, we redirect
  if (!req.session.cartId) {
    return res.redirect('/');
  }

  const cart = await cartsRepo.getOne(req.session.cartId);

  for (let item of cart.items) {
    const product = await productsRepo.getOne(item.id);
    // we modify cart.items but not saving it to the repo, just send with cartShowTemplate
    item.product = product;
  }

  res.send(cartShowTemplate({ items: cart.items }));
});

// Receive a POST request to delete an item from a cart
router.post('/cart/products/delete', async (req, res) => {
  const { itemId } = req.body;
  const cart = await cartsRepo.getOne(req.session.cartId);

  console.log('cart: ', cart);

  // Find item in cart
  const item = cart.items.find((item) => item.id === itemId);

  // Reduce by 1
  --item.quantity;

  // Mutate cart
  if (!item.quantity) {
    // Find item index
    const itemIndex = cart.items.indexOf(item);
    // Remove item
    cart.items.splice(itemIndex, 1);
  }

  await cartsRepo.update(req.session.cartId, { items: cart.items });

  res.redirect('/cart');
});

module.exports = router;
