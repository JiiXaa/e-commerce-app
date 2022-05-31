const layout = require('../layout');

module.exports = () => {
  return layout({
    content: `
      <div>
        <form method="POST">
          <input name="email" placeholder="email"/>
          <input type="password" name="password" placeholder="password"/>
          <button>Sign In</button>
        </form>
      </div>
    `,
  });
};
