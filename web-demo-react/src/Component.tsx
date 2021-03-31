import {
  ChangeEventHandler,
  ClipboardEventHandler,
  DragEventHandler,
  FC,
  Fragment,
  KeyboardEventHandler,
  MouseEventHandler,
  PointerEventHandler,
  useCallback,
} from 'react';

const Component: FC = () => {
  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (e) => console.log('Change', e.target.value, e),
    [],
  );
  const handleClick = useCallback<MouseEventHandler<HTMLInputElement>>(
    (e) => console.log('Click', e.detail, e),
    [],
  );
  const handlePointerEnter = useCallback<PointerEventHandler<HTMLInputElement>>(
    (e) => console.log('Enter', e.pointerType, e),
    [],
  );
  const handlePointerOut = useCallback<PointerEventHandler<HTMLInputElement>>(
    (e) => console.log('Out', e.pointerType, e),
    [],
  );
  const handleDrag = useCallback<DragEventHandler<HTMLSpanElement>>((e) => {
    e.dataTransfer.setData('text/plain', 'Hello World!');
    console.log('Drag', e.dataTransfer.getData('text'), e);
  }, []);
  const handleDrop = useCallback<DragEventHandler<HTMLSpanElement>>(
    (e) => console.log('Drop', e.dataTransfer.getData('text'), e),
    [],
  );
  const handleKeyPress = useCallback<KeyboardEventHandler<HTMLInputElement>>(
    (e) => {
      const { altKey, ctrlKey, code, shiftKey } = e;
      const prefix =
        (ctrlKey ? 'ctrl+' : '') +
        (altKey ? 'alt+' : '') +
        (shiftKey ? 'shift+' : '');
      console.log('Press', prefix + code, e);
    },
    [],
  );
  const handleCut = useCallback<ClipboardEventHandler<HTMLInputElement>>(
    (e) => console.log('Cut', String(window.getSelection() || ''), e),
    [],
  );
  const handleCopy = useCallback<ClipboardEventHandler<HTMLInputElement>>(
    (e) => console.log('Copy', String(window.getSelection() || ''), e),
    [],
  );
  const handlePaste = useCallback<ClipboardEventHandler<HTMLInputElement>>(
    (e) => console.log('Paste', e.clipboardData.getData('text'), e),
    [],
  );
  return (
    <Fragment>
      <span draggable={true} onDragStart={handleDrag}>
        Drag
      </span>
      <span onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
        Drop
      </span>
      <input
        onClick={handleClick}
        onPointerEnter={handlePointerEnter}
        onPointerOut={handlePointerOut}
        onKeyPress={handleKeyPress}
        onChange={handleChange}
        onCut={handleCut}
        onCopy={handleCopy}
        onPaste={handlePaste}
      />
    </Fragment>
  );
};

export default Component;
