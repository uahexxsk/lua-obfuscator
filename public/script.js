// Elements
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const obfuscateBtn = document.getElementById('obfuscateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const copyBtn = document.getElementById('copyBtn');
const codePreview = document.getElementById('codePreview');
const status = document.getElementById('status');
const loadingOverlay = document.getElementById('loadingOverlay');
const filePreview = document.getElementById('filePreview');
const changeFileBtn = document.getElementById('changFileBtn');
const codeStats = document.getElementById('codeStats');
const codeInfo = document.querySelector('.code-info');

// State
let currentFileName = '';
let currentCode = '';
let obfuscatedCode = '';

// Event Listeners
fileInput.addEventListener('change', handleFileSelect);
dropZone.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('dragover', handleDragOver);
dropZone.addEventListener('dragleave', handleDragLeave);
dropZone.addEventListener('drop', handleFileDrop);
obfuscateBtn.addEventListener('click', obfuscateCode);
downloadBtn.addEventListener('click', downloadFile);
copyBtn.addEventListener('click', copyCode);
changeFileBtn?.addEventListener('click', () => fileInput.click());

// File handling
function handleFileSelect(e) {
  const files = e.target.files;
  if (files.length > 0) {
    processFile(files[0]);
  }
}

function handleDragOver(e) {
  e.preventDefault();
  dropZone.classList.add('active');
}

function handleDragLeave(e) {
  e.preventDefault();
  dropZone.classList.remove('active');
}

function handleFileDrop(e) {
  e.preventDefault();
  dropZone.classList.remove('active');
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    processFile(files[0]);
  }
}

function processFile(file) {
  if (!file.name.endsWith('.lua')) {
    showStatus('❌ Chỉ hỗ trợ file .lua', 'error');
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    showStatus('❌ File quá lớn (tối đa 10MB)', 'error');
    return;
  }

  currentFileName = file.name;
  const reader = new FileReader();

  reader.onload = (e) => {
    currentCode = e.target.result;
    codePreview.value = currentCode;
    obfuscateBtn.style.display = 'flex';
    copyBtn.style.display = 'inline-flex';
    downloadBtn.style.display = 'none';
    dropZone.style.display = 'none';
    filePreview.style.display = 'block';

    // Update preview
    document.getElementById('previewName').textContent = currentFileName;
    document.getElementById('previewSize').textContent = formatBytes(file.size);

    showStatus(`✅ Tải lên file: ${currentFileName}`, 'success');
    clearProgress();
    showProgressItem('progress-upload');
  };

  reader.onerror = () => {
    showStatus('❌ Lỗi khi đọc file', 'error');
  };

  reader.readAsText(file);
}

// Obfuscate
async function obfuscateCode() {
  if (!currentCode) {
    showStatus('❌ Vui lòng tải lên file Lua', 'error');
    return;
  }

  const options = {
    encryptStrings: document.getElementById('encryptStrings').checked,
    obfuscateNames: document.getElementById('obfuscateNames').checked,
    controlFlow: document.getElementById('controlFlow').checked,
    removeComments: document.getElementById('removeComments').checked,
    removeWhitespace: document.getElementById('removeWhitespace').checked
  };

  showLoading(true);
  clearProgress();
  showProgressItem('progress-upload');

  try {
    const formData = new FormData();
    const blob = new Blob([currentCode], { type: 'text/plain' });
    formData.append('file', blob, currentFileName);
    formData.append('options', JSON.stringify(options));

    // Simulate progress
    const progressInterval = setInterval(() => {
      const fill = document.getElementById('progressFill');
      const current = parseInt(fill.style.width || '0');
      if (current < 90) {
        fill.style.width = (current + Math.random() * 20) + '%';
      }
    }, 300);

    const response = await fetch('/api/obfuscate', {
      method: 'POST',
      body: formData
    });

    clearInterval(progressInterval);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Lỗi obfuscate');
    }

    const data = await response.json();
    obfuscatedCode = data.obfuscatedCode;
    codePreview.value = obfuscatedCode;
    downloadBtn.style.display = 'inline-flex';

    // Update stats
    document.getElementById('originalSize').textContent = formatBytes(data.originalSize);
    document.getElementById('obfuscatedSize').textContent = formatBytes(data.obfuscatedSize);
    codeInfo.classList.add('show');

    // Show progress items
    if (options.encryptStrings) showProgressItem('progress-encrypt');
    if (options.obfuscateNames) showProgressItem('progress-obfuscate');
    if (options.controlFlow) showProgressItem('progress-flow');
    showProgressItem('progress-done');

    showStatus('✅ Obfuscate thành công! Sẵn sàng tải file.', 'success');
  } catch (error) {
    showStatus(`❌ Lỗi: ${error.message}`, 'error');
  } finally {
    showLoading(false);
  }
}

// Download
async function downloadFile() {
  if (!obfuscatedCode) {
    showStatus('❌ Không có mã obfuscate', 'error');
    return;
  }

  try {
    const response = await fetch('/api/download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code: obfuscatedCode,
        fileName: currentFileName
      })
    });

    if (!response.ok) {
      throw new Error('Lỗi tải file');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFileName.replace('.lua', '_obfuscated.lua');
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    showStatus('✅ Tải file thành công!', 'success');
  } catch (error) {
    showStatus(`❌ Lỗi: ${error.message}`, 'error');
  }
}

// Copy
function copyCode() {
  navigator.clipboard
    .writeText(codePreview.value)
    .then(() => {
      showStatus('✅ Sao chép vào clipboard!', 'success');
    })
    .catch((err) => {
      showStatus('❌ Lỗi sao chép', 'error');
    });
}

// UI Helpers
function showLoading(show) {
  if (show) {
    loadingOverlay.classList.add('show');
    document.getElementById('progressFill').style.width = '10%';
  } else {
    loadingOverlay.classList.remove('show');
    document.getElementById('progressFill').style.width = '0%';
  }
}

function showStatus(message, type) {
  status.textContent = message;
  status.className = `alert show ${type}`;
  setTimeout(() => {
    status.classList.remove('show');
  }, 4000);
}

function showProgressItem(id) {
  const item = document.getElementById(id);
  if (item) {
    item.style.display = 'flex';
    item.classList.add('show');
  }
}

function clearProgress() {
  document
    .querySelectorAll('[id^="progress-"]')
    .forEach((item) => {
      item.style.display = 'none';
      item.classList.remove('show');
    });
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Lua Obfuscator loaded successfully');
});
