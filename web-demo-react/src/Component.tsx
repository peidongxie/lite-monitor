import { FC, Fragment, useCallback } from 'react';

const Component: FC = () => {
  const handleChange = useCallback((e) => console.log('Change', e), []);
  const handleClick = useCallback((e) => console.log('Click', e), []);
  const handlePointerEnter = useCallback((e) => console.log('Enter', e), []);
  const handlePointerOut = useCallback((e) => console.log('Out', e), []);
  const handleDrag = useCallback((e) => console.log('Drag', e), []);
  const handleDrop = useCallback((e) => console.log('Drop', e), []);
  const handleKeyPress = useCallback((e) => console.log('Press', e), []);
  const handleCut = useCallback((e) => console.log('Cut', e), []);
  const handleCopy = useCallback((e) => console.log('Copy', e), []);
  const handlePaste = useCallback((e) => console.log('Paste', e), []);
  return (
    <Fragment>
      <span draggable={true} onDragStart={handleDrag}>
        Drag
      </span>
      <div onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
        Drop
      </div>
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
