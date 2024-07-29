'use client';

import { PropsWithChildren } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

type DraggableProps = PropsWithChildren<{
  className?: string;
}>;
export function Draggable({ children, className }: DraggableProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'pointer',
  });

  return (
    <button
      ref={setNodeRef}
      className={`select-none ${className}`}
      style={{
        transform: CSS.Translate.toString(transform),
        touchAction: 'manipulation',
      }}
      {...listeners}
      {...attributes}
    >
      {children}
    </button>
  );
}
