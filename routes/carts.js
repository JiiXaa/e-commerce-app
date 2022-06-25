const express = require('express');
const cartsRepo = require('../repositories/carts');

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
  console.log(cart);
  // Either increment quantity for existing product
  // OR add new product to items array
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

  res.send('Product added to your cart');
});

// Receive a GET request to show all items in cart

// Receive a POST request to delete an item from a cart

module.exports = router;
