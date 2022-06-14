const layout = require('../layout');
const { getError } = require('../../helpers');

// multipart/form-data -- value is necessary if the user will upload a file through the form

// Need to use in combination with to read file data:
// in routes/admin/products.js
// req.on('data', (data) => {
//   console.log(data.toString());
// });
// app.use(express.urlencoded({ extended: true })) will not work for multipart.
// You can use multer

module.exports = ({ errors }) => {
  return layout({
    content: `
      <div class="columns is-centered">
        <div class="column is-half">
          <h1 class="subtitle">Create a Product</h1>

          <form method="POST" enctype="multipart/form-data">
            <div class="field">
              <label class="label">Title</label>
              <input class="input" placeholder="Title" name="title">
              <p class="help is-danger">${getError(errors, 'title')}</p>
            </div>

            <div class="field">
              <label class="label">Price</label>
              <input class="input" placeholder="Price" name="price">
              <p class="help is-danger">${getError(errors, 'price')}</p>
            </div>

            <div class="field">
              <label class="label">Image</label>
              <input type="file" name="image" />
            </div>
            <br />
            <button class="button is-primary">Create</button>
          </form>
        </div>
      </div>
    `,
  });
};
