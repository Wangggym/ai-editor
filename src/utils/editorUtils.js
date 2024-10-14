export const selectCodeBlock = (editor, monaco, startLine, endLine) => {
  if (!editor || !monaco) return;

  const model = editor.getModel();
  const lineCount = model.getLineCount();

  // 如果没有提供 startLine 和 endLine，则随机选择
  if (startLine === undefined || endLine === undefined) {
    startLine = Math.floor(Math.random() * (lineCount - 1)) + 1;
    endLine = Math.min(startLine + Math.floor(Math.random() * 5) + 1, lineCount);
  }

  // 确保 startLine 和 endLine 在有效范围内
  startLine = Math.max(1, Math.min(startLine, lineCount));
  endLine = Math.max(startLine, Math.min(endLine, lineCount));

  const range = new monaco.Range(startLine, 1, endLine, model.getLineMaxColumn(endLine));

  // 清除所有现有的装饰
  const oldDecorations = editor.getModel().getAllDecorations();
  editor.deltaDecorations(oldDecorations.map(d => d.id), []);

  // 添加新的装饰
  editor.deltaDecorations([], [
    { range: range, options: { isWholeLine: true, className: 'myCodeBlockHighlight' } }
  ]);

  // 滚动到高亮区域
  editor.revealRangeInCenter(range);

  // 返回选中的范围
  return range;
};

export const getCurrentCodeBlock = (editor, monaco) => {
  const model = editor.getModel();
  const position = editor.getPosition();
  
  const { startLine, endLine } = findCodeBlock(model, position.lineNumber);
  return { startLine, endLine };
};

const findCodeBlock = (model, currentLine) => {
  const lineContent = model.getLineContent(currentLine).trim();
  
  // 检查是否是单行语句
  if (lineContent.endsWith(';') && !lineContent.includes('{')) {
    return { startLine: currentLine, endLine: currentLine };
  }

  let startLine = currentLine;
  let endLine = currentLine;
  const lineCount = model.getLineCount();

  const isBlockStart = (line) => {
    const content = model.getLineContent(line).trim();
    return content.endsWith('{') || content.includes('{') || content.startsWith('interface') || content.startsWith('type');
  };

  const isBlockEnd = (line) => {
    return model.getLineContent(line).trim().includes('}');
  };

  // 向上查找代码块的开始
  while (startLine > 1 && !isBlockStart(startLine)) {
    startLine--;
  }

  // 查找代码块的结束
  let bracketCount = 0;
  for (let i = startLine; i <= lineCount; i++) {
    const lineContent = model.getLineContent(i).trim();
    bracketCount += (lineContent.match(/{/g) || []).length;
    bracketCount -= (lineContent.match(/}/g) || []).length;
    
    if (bracketCount === 0 && i >= currentLine) {
      endLine = i;
      break;
    }
  }

  // 如果没有找到完整的代码块，回退到基于缩进的选择
  if (startLine === endLine) {
    return fallbackSelection(model, currentLine);
  }

  return { startLine, endLine };
};

const fallbackSelection = (model, currentLine) => {
  let startLine = currentLine;
  let endLine = currentLine;
  const currentIndentation = model.getLineContent(currentLine).match(/^\s*/)[0].length;

  // 向上查找
  while (startLine > 1) {
    const prevLine = startLine - 1;
    const prevContent = model.getLineContent(prevLine).trim();
    const prevIndentation = model.getLineContent(prevLine).match(/^\s*/)[0].length;

    if (prevIndentation < currentIndentation || prevContent === '' || prevContent.startsWith('//')) {
      break;
    }
    startLine = prevLine;
  }

  // 向下查找
  while (endLine < model.getLineCount()) {
    const nextLine = endLine + 1;
    const nextContent = model.getLineContent(nextLine).trim();
    const nextIndentation = model.getLineContent(nextLine).match(/^\s*/)[0].length;

    if (nextIndentation < currentIndentation || nextContent === '' || nextContent.startsWith('//')) {
      break;
    }
    endLine = nextLine;
  }

  return { startLine, endLine };
};
