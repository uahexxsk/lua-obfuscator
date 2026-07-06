class NameObfuscation {
  constructor() {
    this.nameMap = {};
    this.counter = 0;
    this.reserved = new Set([
      'if', 'then', 'else', 'elseif', 'end', 'while', 'do', 'for', 'in',
      'function', 'local', 'return', 'break', 'true', 'false', 'nil',
      'and', 'or', 'not', 'print', 'table', 'string', 'math', 'io'
    ]);
  }

  obfuscateNames(code) {
    // Extract all variable and function names
    const namePattern = /\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g;
    const names = new Set();

    let match;
    while ((match = namePattern.exec(code)) !== null) {
      const name = match[1];
      if (!this.reserved.has(name)) {
        names.add(name);
      }
    }

    // Map each name to an obfuscated name
    names.forEach(name => {
      this.nameMap[name] = this.generateObfuscatedName();
    });

    // Replace all names
    let obfuscatedCode = code;
    for (const [original, obfuscated] of Object.entries(this.nameMap)) {
      const regex = new RegExp(`\\b${original}\\b`, 'g');
      obfuscatedCode = obfuscatedCode.replace(regex, obfuscated);
    }

    return obfuscatedCode;
  }

  generateObfuscatedName() {
    // Generate names like _0, _1, _a, _b, etc.
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let name = '_';
    let n = this.counter++;
    
    if (n < 62) {
      name += chars[n];
    } else {
      while (n > 0) {
        name += chars[n % 62];
        n = Math.floor(n / 62);
      }
    }

    return name;
  }
}

module.exports = NameObfuscation;
