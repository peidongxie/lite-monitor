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
import { ComponentAction, useMonitor } from '@lite-monitor/web';

const Component: FC = () => {
  const monitor = useMonitor();
  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (e) =>
      monitor?.reportComponent(
        'component-input',
        e.currentTarget,
        ComponentAction.CHANGE,
        e.target.value,
      ),
    [monitor],
  );
  const handleClick = useCallback<MouseEventHandler<HTMLInputElement>>(
    (e) =>
      monitor?.reportComponent(
        'component-input',
        e.currentTarget,
        ComponentAction.CLICK,
        String(e.detail),
      ),
    [monitor],
  );
  const handlePointerEnter = useCallback<PointerEventHandler<HTMLInputElement>>(
    (e) =>
      monitor?.reportComponent(
        'component-input',
        e.currentTarget,
        ComponentAction.ENTER,
        e.pointerType,
      ),
    [monitor],
  );
  const handlePointerOut = useCallback<PointerEventHandler<HTMLInputElement>>(
    (e) =>
      monitor?.reportComponent(
        'component-input',
        e.currentTarget,
        ComponentAction.OUT,
        e.pointerType,
      ),
    [monitor],
  );
  const handleDrag = useCallback<DragEventHandler<HTMLSpanElement>>(
    (e) => {
      e.dataTransfer.setData('text/plain', 'Hello World!');
      monitor?.reportComponent(
        'component-span-drag',
        e.currentTarget,
        ComponentAction.DRAG,
        e.dataTransfer.getData('text'),
      );
    },
    [monitor],
  );
  const handleDrop = useCallback<DragEventHandler<HTMLSpanElement>>(
    (e) =>
      monitor?.reportComponent(
        'component-span-drop',
        e.currentTarget,
        ComponentAction.DROP,
        e.dataTransfer.getData('text'),
      ),
    [monitor],
  );
  const handleKeyPress = useCallback<KeyboardEventHandler<HTMLInputElement>>(
    (e) => {
      const { altKey, ctrlKey, code, shiftKey } = e;
      const prefix =
        (ctrlKey ? 'ctrl+' : '') +
        (altKey ? 'alt+' : '') +
        (shiftKey ? 'shift+' : '');
      monitor?.reportComponent(
        'component-input',
        e.currentTarget,
        ComponentAction.PRESS,
        prefix + code,
      );
    },
    [monitor],
  );
  const handleCut = useCallback<ClipboardEventHandler<HTMLInputElement>>(
    (e) =>
      monitor?.reportComponent(
        'component-input',
        e.currentTarget,
        ComponentAction.CUT,
        String(window.getSelection() || ''),
      ),
    [monitor],
  );
  const handleCopy = useCallback<ClipboardEventHandler<HTMLInputElement>>(
    (e) =>
      monitor?.reportComponent(
        'component-input',
        e.currentTarget,
        ComponentAction.COPY,
        String(window.getSelection() || ''),
      ),
    [monitor],
  );
  const handlePaste = useCallback<ClipboardEventHandler<HTMLInputElement>>(
    (e) =>
      monitor?.reportComponent(
        'component-input',
        e.currentTarget,
        ComponentAction.PASTE,
        String(window.getSelection() || ''),
      ),
    [monitor],
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
