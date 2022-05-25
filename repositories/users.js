const fs = require('fs');
const crypto = require('crypto');

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
    attrs.id = this.randomId();

    // every time want to make changes to the list of users, we need to load up contents of users.json
    const records = await this.getAll();
    records.push(attrs);

    await this.writeAll(records);

    return attrs;
  }

  async writeAll(records) {
    // write the updated 'records' array back to this.filename
    // fsPromises.writeFile() writes data to a file, replacing the file if it already exists.
    await fs.promises.writeFile(
      this.filename,
      JSON.stringify(records, null, 2) // second and third argument is a good trick for a automatic json formatting (null/ we could use custom formatter, 2 means level of indentation)
    );
  }

  randomId() {
    // creating 4 byte size random ID with use of nodeJS crypto module.
    return crypto.pseudoRandomBytes(4).toString('hex');
  }

  async getOne(id) {
    const records = await this.getAll();
    return records.find((record) => record.id === id);
  }

  async delete(id) {
    const records = await this.getAll();
    const filteredRecords = records.filter((record) => record.id !== id);
    await this.writeAll(filteredRecords);
  }

  async update(id, attrs) {
    const records = await this.getAll();
    const record = records.find((record) => record.id === id);

    if (!record) {
      throw new Error(`Record with id ${id} not found`);
    }
    // The Object.assign() method copies all enumerable own properties from one or more source objects to a target object. It returns the modified target object.
    Object.assign(record, attrs);
    await this.writeAll(records);
  }

  async getOneBy(filters) {
    const records = await this.getAll();

    for (let record of records) {
      let found = true;

      for (let key in filters) {
        if (record[key] !== filters[key]) {
          found = false;
        }
      }

      if (found) {
        return record;
      }
    }
  }
}

// export instance of a class, no need to create it for different files.
// Just import it:
// const repo = require('./users);
// and use it:
// repo.getAll();
// repo.getOne();
// etc...
module.exports = new UsersRepository('users.json');
