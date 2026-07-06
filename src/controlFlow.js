class ControlFlow {
  constructor() {
    this.junkCode = [
      'local _ = 1 + 1',
      'local __ = math.random()',
      'if true then end',
      'while false do end',
      'for i = 1, 0 do end'
    ];
  }

  flattenControlFlow(code) {
    // Add junk code to make reverse engineering harder
    code = this.addJunkCode(code);
    
    // Wrap code blocks
    code = this.wrapCodeBlocks(code);
    
    return code;
  }

  addJunkCode(code) {
    const lines = code.split('\n');
    const result = [];
    
    lines.forEach((line, index) => {
      result.push(line);
      
      // Add junk code randomly after non-empty lines
      if (line.trim() && Math.random() > 0.7) {
        const junk = this.junkCode[Math.floor(Math.random() * this.junkCode.length)];
        result.push(junk);
      }
    });
    
    return result.join('\n');
  }

  wrapCodeBlocks(code) {
    // Wrap main code in anonymous function
    return `(function()\n${code}\nend)()`;
  }
}

module.exports = ControlFlow;
