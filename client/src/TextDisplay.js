import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TextDisplay({ darkMode, setDarkMode }) {
  const [text, setText] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [fontSize, setFontSize] = useState(16);
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const fetchText = async () => {
    if (!id || !password) {
      setError('IDとパスワードを入力してください。');
      setText([]);  // テキストをクリア
      return;
    }
    try {
      const response = await axios.post('http://localhost:3001/api/texts/get', { id, password });
      setText(response.data);
      setError('');
      setIsStarted(false);
      setCurrentLine(0);
    } catch (error) {
      setError('テキストの取得に失敗しました。IDとパスワードを確認してください。');
      setText([]);  // エラー時にテキストをクリア
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (isStarted && currentLine < text.length) {
      const delay = text[currentLine].length * 200 / speed;
      let startTime = Date.now();
      
      const timer = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        setProgress((elapsedTime / delay) * 100);
        
        if (elapsedTime >= delay) {
          clearInterval(timer);
          setCurrentLine(currentLine + 1);
          setProgress(0);
        }
      }, 10);

      return () => clearInterval(timer);
    }
  }, [currentLine, text, isStarted, speed]);

  const handleStart = () => {
    setIsStarted(true);
    setCurrentLine(0);
  };

  const handleReplay = () => {
    setCurrentLine(0);
    setProgress(0);
    setIsStarted(true);
  };

  const speedOptions = Array.from({ length: 16 }, (_, i) => (0.5 + i * 0.1).toFixed(1));

  return (
    <div className="container">
      <h2>テキスト表示</h2>
      <div className="controls-group">
        <button onClick={() => setDarkMode(!darkMode)} className="mode-toggle">
          {darkMode ? 'ライトモード' : 'ダークモード'}に切り替え
        </button>
        <div className="settings">
          <div className="setting-control">
            <label htmlFor="font-size">文字サイズ変更：</label>
            <select 
              id="font-size"
              value={fontSize} 
              onChange={(e) => setFontSize(Number(e.target.value))}
            >
              <option value={12}>小</option>
              <option value={16}>中</option>
              <option value={20}>大</option>
            </select>
          </div>
          <div className="setting-control">
            <label htmlFor="speed">表示速度：</label>
            <select 
              id="speed"
              value={speed} 
              onChange={(e) => setSpeed(Number(e.target.value))}
              disabled={isStarted && currentLine < text.length}
            >
              {speedOptions.map(option => (
                <option key={option} value={option}>{option}倍速</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div>
        <input
          type="text"
          placeholder="ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={fetchText}>テキスト取得</button>
      </div>
      {error && <p className="error">{error}</p>}
      {!error && text.length > 0 && (
        <div style={{ fontSize: `${fontSize}px` }}>
          {text.slice(0, currentLine + 1).map((line, index) => (
            <p key={index} className={index === currentLine ? 'fade-in' : ''}>{line}</p>
          ))}
        </div>
      )}
      {!error && currentLine < text.length && isStarted && (
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>
      )}
      <div className="controls">
        {!isStarted && text.length > 0 && <button onClick={handleStart}>スタート</button>}
        {isStarted && currentLine >= text.length && <button onClick={handleReplay}>リプレイ</button>}
      </div>
    </div>
  );
}

export default TextDisplay;