let currentFileName = '';
let currentCode = '';
let obfuscatedCode = '';

const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const obfuscateBtn = document.getElementById('obfuscateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const copyBtn = document.getElementById('copyBtn');
const codePreview = document.getElementById('codePreview');
const status = document.getElementById('status');
const loadingOverlay = document.getElementById('loadingOverlay');

// File upload handling
fileInput.addEventListener('change', handleFileSelect);
dropZone.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('dragover', handleDragOver);
dropZone.addEventListener('dragleave', handleDragLeave);
dropZone.addEventListener('drop', handleFileDrop);

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
    showStatus('Chỉ hỗ trợ file .lua', 'error');
    return;
  }

  currentFileName = file.name;
  const reader = new FileReader();
  
  reader.onload = (e) => {
    currentCode = e.target.result;
    codePreview.value = currentCode;
    obfuscateBtn.style.display = 'block';
    copyBtn.style.display = 'block';
    downloadBtn.style.display = 'none';
    showStatus(`Tải lên file: ${currentFileName}`, 'success');
  };
  
  reader.onerror = () => {
    showStatus('Lỗi khi đọc file', 'error');
  };
  
  reader.readAsText(file);
}

// Obfuscate button
obfuscateBtn.addEventListener('click', obfuscateCode);

async function obfuscateCode() {
  if (!currentCode) {
    showStatus('Vui lòng tải lên file Lua', 'error');
    return;
  }

  const options = {
    encryptStrings: document.getElementById('encryptStrings').checked,
    obfuscateNames: document.getElementById('obfuscateNames').checked,
    controlFlow: document.getElementById('controlFlow').checked,
    removeComments: document.getElementById('removeComments').checked,
    removeWhitespace: document.getElementById('removeWhitespace').checked
  };

  loadingOverlay.style.display = 'flex';
  
  try {
    const formData = new FormData();
    const blob = new Blob([currentCode], { type: 'text/plain' });
    formData.append('file', blob, currentFileName);
    formData.append('options', JSON.stringify(options));

    const response = await fetch('/api/obfuscate', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Lỗi obfuscate');
    }

    const data = await response.json();
    obfuscatedCode = data.obfuscatedCode;
    codePreview.value = obfuscatedCode;
    downloadBtn.style.display = 'block';
    showStatus('✅ Obfuscate thành công!', 'success');
  } catch (error) {
    showStatus('Lỗi: ' + error.message, 'error');
  } finally {
    loadingOverlay.style.display = 'none';
  }
}

// Download button
downloadBtn.addEventListener('click', async () => {
  if (!obfuscatedCode) {
    showStatus('Không có mã obfuscate', 'error');
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
    showStatus('Lỗi: ' + error.message, 'error');
  }
});

// Copy button
copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(codePreview.value).then(() => {
    showStatus('✅ Sao chép vào clipboard!', 'success');
  }).catch(err => {
    showStatus('Lỗi sao chép', 'error');
  });
});

function showStatus(message, type) {
  status.textContent = message;
  status.className = 'status ' + type;
  setTimeout(() => {
    status.classList.remove('success', 'error');
    status.style.display = 'none';
  }, 3000);
}
