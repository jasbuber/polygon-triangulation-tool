const http = require('http');
const imageFolder = './images/';
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;
/*
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');

  fs.readdir(imageFolder, (err, files) => {
    files.forEach(file => {
      console.log(file);
    });
  })
});*/

const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log('Example app listening on port 3000!'));