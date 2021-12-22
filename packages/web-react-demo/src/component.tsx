import { ComponentAction, useMonitor } from '@lite-monitor/web';
import {
  Fragment,
  useCallback,
  type ChangeEventHandler,
  type ClipboardEventHandler,
  type DragEventHandler,
  type FC,
  type KeyboardEventHandler,
  type MouseEventHandler,
  type PointerEventHandler,
} from 'react';

const Component: FC = () => {
  const monitor = useMonitor();
  // Report component events
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
  // Report component events
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
  // Report component events
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
  // Report component events
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
  // Report component events
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
  // Report component events
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
  // Report component events
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
  // Report component events
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
  // Report component events
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
  // Report component events
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
        {'Drag'}
      </span>
      <span onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
        {'Drop'}
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

export { Component as default };
