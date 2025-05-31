import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http:function DocumentEditor()')
  
    const [documentId, setDocumentId] = useState('//localhost:3000');

function DocumentEditor() {
  const [documentId, setDocumentId] = useState('');
  const [content, setContent] = useState('');
  const [documentCreated, setDocumentCreated] = useState(false);

  useEffect(() => {
    socket.on('document', (content) => {
      setContent(content);
    });

    socket.on('update', (content) => {
      setContent(content);
    });

    socket.on('document-created', (documentId) => {
      setDocumentId(documentId);
      setDocumentCreated(true);
    });
  }, []);

  const handleCreateDocument = () => {
    socket.emit('create-document');
  };

  const handleJoinDocument = () => {
    socket.emit('join', documentId);
  };

  const handleLeaveDocument = () => {
    socket.emit('leave', documentId);
  };

  const handleUpdateContent = (e) => {
    setContent(e.target.value);
    socket.emit('update', documentId, e.target.value);
  };

  const handleGetDocument = () => {
    socket.emit('get-document', documentId);
  };

  return (
    <div>
      {!documentCreated && (
        <button onClick={handleCreateDocument}>Create Document</button>
      )}
      {documentCreated && (
        <div>
          <input type="text" value={documentId} readOnly />
          <textarea value={content} onChange={handleUpdateContent} />
          <button onClick={handleLeaveDocument}>Leave Document</button>
        </div>
      )}
      <input type="text" value={documentId} onChange={(e) => setDocumentId(e.target.value)} />
      <button onClick={handleJoinDocument}>Join Document</button>
      <button onClick={handleGetDocument}>Get Document</button>
    </div>
  );
}

export default DocumentEditor;