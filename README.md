# E-Commerce Application

Made purely with Javascript and NodeJS for practice purposes

## Administrator Access

Administrator has access to the dashboard panel

- register/login functionality
- create/edit/delete products

## Database

Data is stored with the fs (file system) module for an educational purpose (will migrate to MongoDB in future)

## Authentication

Auth done with use of Crypto, a NodeJs's module

- crypto.randomBytes (generating salt)
- crypto.scrypt (hashing password process)

## Server-side validation

express-validator used for server side validation

https://express-validator.github.io/docs/

## Uploading files

Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files. It is written on top of busboy for maximum efficiency.

NOTE: Multer will not process any form which is not multipart (multipart/form-data).

used MemoryStorage.
The memory storage engine stores the files in memory as Buffer objects. It doesn't have any options.

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
