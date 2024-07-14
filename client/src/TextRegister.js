import React, { useState } from 'react';
import axios from 'axios';

function TextRegister() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/texts', {
        id,
        password,
        content: content.split('\n')
      });
      setMessage('テキストが正常に登録されました！');
      setId('');
      setPassword('');
      setContent('');
    } catch (error) {
      setMessage('エラーが発生しました。もう一度お試しください。');
      console.error('Error:', error);
    }
  };

  return (
    <div className="container">
      <h2>テキスト登録</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <textarea
          placeholder="テキスト内容（改行で区切ってください）"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit">登録</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default TextRegister;