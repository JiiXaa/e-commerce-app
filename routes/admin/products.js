const express = require('express');
const { validationResult } = require('express-validator');
// Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files. It is written on top of busboy for maximum efficiency.
const multer = require('multer');

const productsRepo = require('../../repositories/products');
const productsNewTemplate = require('../../views/admin/products/new');
const { requireTitle, requirePrice } = require('./validators');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/admin/products', (req, res) => {});

router.get('/admin/products/new', (req, res) => {
  // passing empty {} to avoid error.
  res.send(productsNewTemplate({}));
});

router.post(
  '/admin/products/new',
  upload.single('image'), // it looks for input's name attribute in a form. It has to be on top of validators as it gets access to req.body instead of express.urlencoded
  [requireTitle, requirePrice],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.send(productsNewTemplate({ errors }));
    }

    // logs file information
    // console.log(req.file);

    // base64 is a safe way to store images.
    const image = req.file.buffer.toString('base64');
    const { title, price } = req.body;
    await productsRepo.create({ title, price, image });

    res.send('submitted');
  }
);

module.exports = router;
