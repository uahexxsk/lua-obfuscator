# 🔐 Lua Obfuscator

Công cụ bảo vệ mã nguồn Lua với mã hoá chuỗi, che giấu tên biến/hàm, và kiểm soát luồng nâng cao.

## ✨ Tính năng

### 1. Mã hoá chuỗi (String Encryption)
- Mã hoá tất cả chuỗi trong mã Lua
- Hỗ trợ AES-256-CBC và XOR encryption
- Tự động giải mã khi chạy

### 2. Làm mờ tên (Name Obfuscation)
- Đổi tên các biến, hàm thành ký tự ngẫu nhiên
- Giữ lại từ khóa Lua gốc
- Làm khó đọc và reverse engineering

### 3. Kiểm soát luồng (Control Flow)
- Thêm mã rác (junk code) để làm phức tạp
- Bao bọc mã chính trong hàm ẩn danh
- Đánh lạc hướng các công cụ phân tích

### 4. Tính năng bổ sung
- Xoá bình luận
- Xoá khoảng trắng không cần thiết
- Giao diện web thân thiện
- Upload/Download file dễ dàng
- Preview mã obfuscate trực tiếp

## 🚀 Cài đặt

### Yêu cầu
- Node.js 14+
- npm hoặc yarn

### Bước 1: Clone repository
```bash
git clone https://github.com/uahexxsk/lua-obfuscator.git
cd lua-obfuscator
```

### Bước 2: Cài đặt dependencies
```bash
npm install
```

### Bước 3: Chạy server
```bash
npm start
```

Server sẽ chạy tại `http://localhost:3000`

## 📖 Hướng dẫn sử dụng

### Qua giao diện web

1. **Tải lên file Lua**
   - Kéo thả file vào drop zone hoặc click để chọn file

2. **Chọn tùy chọn obfuscation**
   - Mã hoá chuỗi
   - Làm mờ tên biến/hàm
   - Kiểm soát luồng
   - Xoá bình luận
   - Xoá khoảng trắng

3. **Click nút "Obfuscate"**
   - Hệ thống sẽ xử lý file Lua của bạn

4. **Xem preview hoặc tải file**
   - Xem code obfuscate ngay trong trình duyệt
   - Sao chép code hoặc tải file về máy

### Qua API

#### Endpoint: POST `/api/obfuscate`

```bash
curl -X POST -F "file=@script.lua" http://localhost:3000/api/obfuscate
```

**Response:**
```json
{
  "success": true,
  "obfuscatedCode": "obfuscated lua code here...",
  "fileName": "script.lua"
}
```

#### Endpoint: POST `/api/download`

```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"code":"lua code","fileName":"script.lua"}' \
  http://localhost:3000/api/download -o script_obfuscated.lua
```

#### Endpoint: POST `/api/preview`

```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"code":"lua code","options":{"encryptStrings":true}}' \
  http://localhost:3000/api/preview
```

## 📁 Cấu trúc dự án

```
lua-obfuscator/
├── public/                 # Giao diện web
│   ├── index.html
│   ├── style.css
│   └── script.js
├── src/                    # Core obfuscator
│   ├── obfuscator.js      # Main obfuscator class
│   ├── stringEncryption.js # String encryption module
│   ├── nameObfuscation.js # Name obfuscation module
│   └── controlFlow.js     # Control flow module
├── server.js              # Express server
└── package.json           # Dependencies
```

## ⚙️ Tùy chọn obfuscation

```javascript
const options = {
  encryptStrings: true,      // Mã hoá chuỗi
  obfuscateNames: true,      // Làm mờ tên
  controlFlow: true,         // Kiểm soát luồng
  removeComments: true,      // Xoá bình luận
  removeWhitespace: true     // Xoá khoảng trắng
};
```

## 🔍 Ví dụ

### Trước obfuscation
```lua
function calculateSum(a, b)
  -- Hàm tính tổng
  local result = a + b
  return result
end

local x = 10
local y = 20
print(calculateSum(x, y))
```

### Sau obfuscation
```lua
local __e = {
  __s0 = "encrypted_string_here",
}

(function()
  local _0 = 1 + 1
  function _1(_2, _3)
    local _4 = _2 + _3
    return _4
  end
  local _5 = 10
  local _6 = 20
  print(_1(_5, _6))
end)()
```

## ⚠️ Lưu ý bảo mật

1. **Obfuscation không phải mã hoá thực sự** - nó chỉ làm khó đọc mã mà thôi
2. **Không an toàn 100%** - có thể bị reverse engineering bằng công cụ chuyên dụng
3. **Kết hợp với các biện pháp khác:**
   - Xử lý logic nhạy cảm trên server
   - Kiểm tra tính toàn vẹn mã
   - Sử dụng bytecode compilation khi có thể

## 🤝 Đóng góp

Xin vui lòng fork repository và gửi pull request

## 📄 License

MIT License - xem file LICENSE để chi tiết

## 📞 Liên hệ

- GitHub: [@uahexxsk](https://github.com/uahexxsk)
- Issues: [GitHub Issues](https://github.com/uahexxsk/lua-obfuscator/issues)

---

**Làm cho mã Lua của bạn an toàn hơn! 🔒**
