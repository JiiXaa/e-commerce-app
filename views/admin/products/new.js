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
      <form method="POST" enctype="multipart/form-data">
        <input placeholder="Title" name="title" />
        ${getError(errors, 'title')}
        <input placeholder="Price" name="price" />
        ${getError(errors, 'price')}
        <input type="file" name="image" />
        <button>Add</button>
      </form>
    `,
  });
};
