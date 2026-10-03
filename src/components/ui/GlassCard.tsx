import type { HTMLAttributes, ReactNode } from 'react';

export function GlassCard({ className, children, as: Tag = 'div', ...rest }: HTMLAttributes<HTMLElement> & { as?: 'div' | 'section' | 'article' | 'aside'; children: ReactNode }) {
  return (
    <Tag className={`glass rounded-2xl ${className ?? ''}`} {...rest}>
      {children}
    </Tag>
  );
}
