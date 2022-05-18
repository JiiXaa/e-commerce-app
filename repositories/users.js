const fs = require('fs');

class UsersRepository {
  constructor(filename) {
    if (!filename) {
      throw new Error('Creating a repository requires a filename');
    }

    this.filename = filename;
    try {
      // Used synchronous version of fs.access because Class Constructor cannot be async in nature.
      // synchronous methods will work in this case because UsersRepository will be created only once.
      // fs.access checks if filename exists, and if not it will throw an error.
      fs.accessSync(this.filename);
    } catch (error) {
      // The fs.writeFile() method is used to asynchronously write the specified data to a file. By default, the file would be replaced if it exists.
      // If filename doesn't exist, fs.writeFile will create it with [] inside.
      fs.writeFileSync(this.filename, '[]');
    }
  }
}

const repo = new UsersRepository('users.json');
