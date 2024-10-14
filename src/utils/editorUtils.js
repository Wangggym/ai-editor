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
