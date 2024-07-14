import React, { useState } from 'react';

function Login({ setIsLoggedIn, darkMode, setDarkMode }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  return (
    <div className="container">
      <h1>ようこそ</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="ID" 
          value={id} 
          onChange={(e) => setId(e.target.value)}
          aria-label="ID"
        />
        <input 
          type="password" 
          placeholder="パスワード" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          aria-label="パスワード"
        />
        <button type="submit">ログイン</button>
      </form>
      <button onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? 'ライトモード' : 'ダークモード'}に切り替え
      </button>
    </div>
  );
}

export default Login;