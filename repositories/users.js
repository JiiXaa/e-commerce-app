const { create } = require('domain');
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

  async getAll() {
    // Open the file called this.filename and parse the contents
    return JSON.parse(
      await fs.promises.readFile(this.filename, {
        encoding: 'utf8',
      })
    );
  }

  async create(attrs) {
    // every time want to make changes to the list of users, we need to load up contents of users.json
    const records = await this.getAll();
    records.push(attrs);

    await this.writeAll(records);
  }

  async writeAll(records) {
    // write the updated 'records' array back to this.filename
    // fsPromises.writeFile() writes data to a file, replacing the file if it already exists.
    await fs.promises.writeFile(
      this.filename,
      JSON.stringify(records, null, 2) // second and third argument is a good trick for a automatic json formatting (null/ we could use custom formatter, 2 means level of indentation)
    );
  }
}

const test = async () => {
  const repo = new UsersRepository('users.json');

  repo.create({ email: 'tests@mail.com', password: 'password' });

  const users = await repo.getAll();

  console.log(users);
};

test();
