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

  return (
    <div
      ref={setNodeRef}
      style={{ gridArea: `i${choice}` }}
      className={className}
      data-area={`i${choice}`}
      data-is-over={isOver}
      data-active={Boolean(active)}
      data-selected={selected}
    >
      {children}
    </div>
  );
}
