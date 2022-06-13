const layout = require('../layout');
const { getError } = require('../../helpers');

// multipart/form-data -- value is necessary if the user will upload a file through the form

// Need to use in combination with to read file data:
// in routes/admin/products.js
// req.on('data', (data) => {
//   console.log(data.toString());
// });

module.exports = ({ errors }) => {
  return layout({
    content: `
      <form method="POST" enctype="multipart/form-data">
        <input placeholder="Title" name="title" />
        <input placeholder="Price" name="price" />
        <input type="file" name="image" />
        <button>Add</button>
      </form>
    `,
  });
};
