import { FC, DragEvent, PropsWithChildren, CSSProperties } from 'react';
import classNames from 'classnames';
import './index.less';

type DropTypes = {
  visible: boolean;
  onDragEnter?: (e: DragEvent) => void;
  onDrop?: (e: DragEvent) => void;
  onDragOver?: (e: DragEvent) => void;
  onDragLeave?: (e: DragEvent) => void;
  className?: string;
  style?: CSSProperties;
};

const Drop: FC<PropsWithChildren<DropTypes>> = ({
  visible,
  onDrop,
  onDragEnter,
  onDragOver,
  onDragLeave,
  children,
  className,
  style,
}) => {
  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    onDrop && onDrop(e);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    onDragOver && onDragOver(e);
  };

  const handleDragEnter = (e: DragEvent) => {
    onDragEnter && onDragEnter(e);
  };

  const handleDragLeave = (e: DragEvent) => {
    onDragLeave && onDragLeave(e);
  };

  if (!visible) return null;

  return (
    <div
      className={classNames('drop-area', className)}
      onDragEnter={handleDragEnter}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      style={style}
    >
      {children}
    </div>
  );
};

Drop.defaultProps = {
  visible: false,
  onDrop: () => {},
  onDragEnter: () => {},
  onDragOver: () => {},
  onDragLeave: () => {},
};

export default Drop;
