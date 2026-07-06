const crypto = require('crypto');

class StringEncryption {
  constructor() {
    this.key = crypto.randomBytes(16).toString('hex');
    this.encryptedStrings = {};
    this.decryptionCode = '';
  }

  encryptStrings(code) {
    const stringPattern = /(['"])(?:(?=(\\?))\2.)*?\1/g;
    let counter = 0;
    const encrypted = {};

    code = code.replace(stringPattern, (match) => {
      const stringVar = `__s${counter++}`;
      encrypted[stringVar] = this.encryptAES(match.slice(1, -1));
      return stringVar;
    });

    // Generate decryption helper
    const decryptionCode = this.generateDecryptionCode(encrypted);
    code = decryptionCode + '\n' + code;

    return code;
  }

  encryptAES(str) {
    try {
      const cipher = crypto.createCipher('aes-256-cbc', this.key);
      let encrypted = cipher.update(str, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      return encrypted;
    } catch (e) {
      // Fallback to XOR if AES fails
      return this.encryptXOR(str);
    }
  }

  encryptXOR(str) {
    let result = '';
    const key = 0x42; // XOR key
    for (let i = 0; i < str.length; i++) {
      result += String.fromCharCode(str.charCodeAt(i) ^ key);
    }
    return Buffer.from(result).toString('base64');
  }

  generateDecryptionCode(encrypted) {
    let code = `local __e = {\n`;
    for (const [varName, encryptedStr] of Object.entries(encrypted)) {
      code += `  ${varName} = "${encryptedStr}",\n`;
    }
    code += `}\n`;
    code += `local __k = "${this.key}"\n`;
    code += `function __d(s)\n`;
    code += `  return s\n`; // Placeholder for actual decryption
    code += `end\n`;
    return code;
  }
}

module.exports = StringEncryption;
