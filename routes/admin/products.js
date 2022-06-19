const express = require('express');
// Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files. It is written on top of busboy for maximum efficiency.
const multer = require('multer');

const { handleErrors, requireAuth } = require('./middlewares');
const productsRepo = require('../../repositories/products');
const productsNewTemplate = require('../../views/admin/products/new');
const productsIndexTemplate = require('../../views/admin/products/index');
const productsEditTemplate = require('../../views/admin/products/edit');
const { requireTitle, requirePrice } = require('./validators');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/admin/products', requireAuth, async (req, res) => {
  const products = await productsRepo.getAll();
  res.send(productsIndexTemplate({ products }));
});

router.get('/admin/products/new', requireAuth, (req, res) => {
  // passing empty {} to avoid error.
  res.send(productsNewTemplate({}));
});

router.post(
  '/admin/products/new',
  requireAuth,
  upload.single('image'), // it looks for input's name attribute in a form. It has to be on top of validators as it gets access to req.body instead of express.urlencoded
  [requireTitle, requirePrice],
  handleErrors(productsNewTemplate),
  async (req, res) => {
    // to log file information
    // console.log(req.file);

    // base64 is a safe way to store images.
    const image = req.file.buffer.toString('base64');
    const { title, price } = req.body;
    await productsRepo.create({ title, price, image });

    res.redirect('/admin/products');
  }
);

// req for editing products, href mapped for every button and located in views/admin/products/index.js
router.get('/admin/products/:id/edit', requireAuth, async (req, res) => {
  const product = await productsRepo.getOne(req.params.id);

  if (!product) {
    return res.send('Product not found');
  }

  res.send(productsEditTemplate({ product }));
});

router.post(
  '/admin/products/:id/edit',
  requireAuth,
  upload.single('image'),
  [requireTitle, requirePrice],
  // second argument is optional, in case if there will be a problem with productsEditTemplate as it expects a { product } and we does not have access to it in this case
  handleErrors(productsEditTemplate, async (req) => {
    const product = await productsRepo.getOne(req.params.id);
    // we put product as a additional data in our errors template
    return { product };
  }),
  async (req, res) => {
    const changes = req.body;

    if (req.file) {
      changes.image = req.file.buffer.toString('base64');
    }

    try {
      await productsRepo.update(req.params.id, changes);
    } catch (err) {
      return res.send('Could not find item.');
    }

    res.redirect('/admin/products');
  }
);

module.exports = router;
