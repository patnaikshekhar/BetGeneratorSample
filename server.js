const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const DocumentClient = new require('documentdb').DocumentClient
const client = new DocumentClient('https://shekhar-sample-1.documents.azure.com:443/', {
  masterKey: 'otcys43Yv7GKLk46iWhflBtMBKMIfWf8Lxxg3yrfr1GCSQNjSx5ysP3o0QBDwkCKnSvAWAVDL2b9j3KURtvszw=='
})

const coll = 'dbs/F2VvAA==/colls/F2VvALbEH1E=/'
// const db = 'dbs/F2VvAA==/'
app.use(bodyParser.json())

app.get('/books', (req, res) => {
  client.queryDocuments(coll, { query: 'SELECT Books.id, Books.name FROM Books'}).toArray((err, books) => {
    if (err) {
      console.error(err)
      res.status(500).json({
        status: 'error',
        error: JSON.stringify(err)
      })
    } else {
      res.json({
        status: 'success',
        books
      })
    }
  })
})

app.post('/book', (req, res) => {
  client.createDocument(coll, Object.assign(req.body), (err, doc) => {
    if (err) {
      console.error(err)
      res.status(500).json({
        status: 'error',
        error: err
      })
    } else {
      res.json({
        status: 'success'
      })
    }  
  })
})

app.listen(process.env.PORT || 8090, () => {
  console.log('Server started')
})

// var http = require('http');

// var server = http.createServer(function(request, response) {

//     response.writeHead(200, {"Content-Type": "text/plain"});
//     response.end("Hello World!");

// });

// var port = process.env.PORT || 1337;
// server.listen(port);

// console.log("Server running at http://localhost:%d", port);