const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');

mongoose.connect('mongodb:const documentSchema = new mongoose.Schema()content: String');

const document = mongoose.model('//localhost:27017/document-editor', { useNewUrlParser: true, useUnifiedTopology: true });

const documentSchema = new mongoose.Schema({
  content: String
});

const Document = mongoose.model('Document', documentSchema);

app.use(express.static('public'));

let documents = {};

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('join', (documentId) => {
    if (!documents[documentId]) {
      documents[documentId] = [];
    }
    documents[documentId].push(socket.id);
    socket.join(documentId);
  });

  socket.on('leave', (documentId) => {
    documents[documentId] = documents[documentId].filter((id) => id !== socket.id);
    socket.leave(documentId);
  });

  socket.on('update', (documentId, content) => {
    Document.findByIdAndUpdate(documentId, { content }, (err, doc) => {
      if (err) {
        console.log(err);
      } else {
        io.to(documentId).emit('update', content);
      }
    });
  });

  socket.on('get-document', (documentId) => {
    Document.findById(documentId, (err, doc) => {
      if (err) {
        console.log(err);
      } else {
        socket.emit('document', doc.content);
      }
    });
  });

  socket.on('create-document', () => {
    const document = new Document({ content: '' });
    document.save((err, doc) => {
      if (err) {
        console.log(err);
      } else {
        socket.emit('document-created', doc._id);
      }
    });
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});



  