'use client';

import { PropsWithChildren } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

type DraggableProps = PropsWithChildren<{
  className?: string;
}>;
export function Draggable({ children, className }: DraggableProps) {
  const { attributes, listeners, setNodeRef, transform, over } = useDraggable({
    id: 'pointer',
  });

  return (
    <button
      ref={setNodeRef}
      className={className}
      data-is-over={Boolean(over)}
      style={{
        transform: CSS.Translate.toString(transform),
        gridArea: 'p',
      }}
      {...listeners}
      {...attributes}
    >
      {children}
    </button>
  );
}
