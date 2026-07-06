const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const Obfuscator = require('./src/obfuscator');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static('public'));

// Multer configuration
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.lua') {
      cb(null, true);
    } else {
      cb(new Error('Only .lua files are allowed'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Create uploads directory
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API Routes
app.post('/api/obfuscate', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Không có file được tải lên' });
    }

    const code = req.file.buffer.toString('utf-8');
    const options = req.body.options ? JSON.parse(req.body.options) : {};
    const obfuscator = new Obfuscator(code, options);
    const obfuscatedCode = obfuscator.obfuscate();

    res.json({
      success: true,
      obfuscatedCode: obfuscatedCode,
      fileName: req.file.originalname,
      originalSize: code.length,
      obfuscatedSize: obfuscatedCode.length
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/download', (req, res) => {
  try {
    const { code, fileName } = req.body;
    const newFileName = fileName.replace('.lua', '_obfuscated.lua');
    
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${newFileName}"`);
    res.send(code);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/preview', (req, res) => {
  try {
    const { code } = req.body;
    const options = req.body.options || {};
    const obfuscator = new Obfuscator(code, options);
    const obfuscatedCode = obfuscator.obfuscate();
    
    res.json({
      success: true,
      obfuscatedCode: obfuscatedCode
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`
${'='.repeat(50)}`);
  console.log(`🚀 Lua Obfuscator Server`);
  console.log(`✅ Running on http://localhost:${PORT}`);
  console.log(`${'='.repeat(50)}\n`);
});

module.exports = app;
