const throwException = () => {
  throw new DOMException('The request is not allowed', 'NotAllowedError');
};

const wrapFunction = (f: () => void) => {
  try {
    f();
  } catch (e) {
    return e;
  }
};

const execCommand = () => {
  const success = window.document.execCommand('copy');
  if (!success) throwException();
};

const selectSpan = (text: string) => {
  const span = document.createElement('span');
  const selection = window.getSelection();
  const range = document.createRange();
  span.textContent = text;
  span.style.whiteSpace = 'pre';
  span.style.userSelect = 'all';
  document.body.appendChild(span);
  selection?.removeAllRanges();
  range.selectNode(span);
  selection?.addRange(range);
  const e = wrapFunction(execCommand);
  selection?.removeAllRanges();
  document.body.removeChild(span);
  if (e) throw e;
};

export const copy = async (text) => {
  try {
    if (!navigator.clipboard) throwException();
    await navigator.clipboard.writeText(text);
  } catch (e) {
    throw wrapFunction(() => selectSpan(text)) || e;
  }
};
