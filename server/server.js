const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB接続
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// テキストデータのスキーマ
const textSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  content: [String]
});

const Text = mongoose.model('Text', textSchema);

// テキスト登録API
app.post('/api/texts', async (req, res) => {
  try {
    const { id, password, content } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const text = new Text({ id, password: hashedPassword, content });
    await text.save();
    res.status(201).send('Text registered successfully');
  } catch (error) {
    res.status(400).send('Error registering text');
  }
});

// テキスト取得API
app.post('/api/texts/get', async (req, res) => {
  try {
    const { id, password } = req.body;
    const text = await Text.findOne({ id });
    if (!text) {
      return res.status(404).send('Text not found');
    }
    const isMatch = await bcrypt.compare(password, text.password);
    if (!isMatch) {
      return res.status(401).send('Invalid password');
    }
    res.json(text.content);
  } catch (error) {
    res.status(400).send('Error retrieving text');
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    });
}