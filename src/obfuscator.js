const StringEncryption = require('./stringEncryption');
const NameObfuscation = require('./nameObfuscation');
const ControlFlow = require('./controlFlow');

class Obfuscator {
  constructor(code, options = {}) {
    this.code = code;
    this.options = {
      encryptStrings: options.encryptStrings !== false,
      obfuscateNames: options.obfuscateNames !== false,
      controlFlow: options.controlFlow !== false,
      removeComments: options.removeComments !== false,
      removeWhitespace: options.removeWhitespace !== false,
      ...options
    };
  }

  obfuscate() {
    let code = this.code;

    // Step 1: Remove comments if enabled
    if (this.options.removeComments) {
      code = this.removeComments(code);
    }

    // Step 2: Encrypt strings
    if (this.options.encryptStrings) {
      const stringEncryption = new StringEncryption();
      code = stringEncryption.encryptStrings(code);
    }

    // Step 3: Obfuscate names
    if (this.options.obfuscateNames) {
      const nameObfuscation = new NameObfuscation();
      code = nameObfuscation.obfuscateNames(code);
    }

    // Step 4: Control flow flattening
    if (this.options.controlFlow) {
      const controlFlow = new ControlFlow();
      code = controlFlow.flattenControlFlow(code);
    }

    // Step 5: Remove unnecessary whitespace
    if (this.options.removeWhitespace) {
      code = this.removeWhitespace(code);
    }

    return code;
  }

  removeComments(code) {
    // Remove single-line comments
    code = code.replace(/--[^\n]*\n/g, '\n');
    // Remove multi-line comments
    code = code.replace(/--\[\[([\s\S]*?)\]\]/g, '');
    return code;
  }

  removeWhitespace(code) {
    // Keep only necessary whitespace
    code = code.replace(/^\s*$/gm, ''); // Remove empty lines
    code = code.replace(/\n+/g, '\n'); // Reduce multiple newlines
    return code;
  }
}

module.exports = Obfuscator;
