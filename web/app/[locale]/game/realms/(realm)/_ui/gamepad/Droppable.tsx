'use client';

import type { PropsWithChildren } from 'react';
import { useDroppable } from '@dnd-kit/core';

type DroppableProps = PropsWithChildren<{
  choice: number;
  selected?: boolean;
  className?: string;
}>;
export function Droppable({
  choice,
  selected,
  children,
  className,
}: DroppableProps) {
  const { isOver, setNodeRef, active } = useDroppable({
    id: `choice#${choice}`,
  });
  const style = {
    transform: isOver ? 'scale(1.2)' : undefined,
    transition: 'transform 0.2s',
    backgroundColor: active ? 'rgba(255, 255, 255, 0.1)' : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      className={`${className} ${selected ? 'animate-glow' : ''}`}
      style={style}
    >
      {children}
    </div>
  );
}
