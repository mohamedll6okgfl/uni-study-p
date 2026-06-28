import React from 'react';

export interface CardProps {
  children:   React.ReactNode;
  className?: string;
  style?:     React.CSSProperties;
  hover?:     boolean;          // enables hover shadow + translate-y-px
  selected?:  boolean;          // ring-2 ring-brand-500 highlight
  padding?:   'none' | 'sm' | 'md' | 'lg';  // default: 'md'
  onClick?:   () => void;
  as?:        'div' | 'article' | 'li';     // default: 'div'
}

const paddingClasses = {
  none: 'p-0',
  sm:   'p-3',
  md:   'p-5',
  lg:   'p-6',
};

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  style,
  hover = false,
  selected = false,
  padding = 'md',
  onClick,
  as: Component = 'div',
}) => {
  const baseClass = 'bg-[--bg-card] border border-[--border] rounded-xl shadow-card transition-all duration-150';
  const hoverClass = hover ? 'hover:shadow-card-hover hover:-translate-y-px cursor-pointer' : '';
  const selectedClass = selected ? 'ring-2 ring-brand-500 ring-offset-2 ring-offset-[--bg-page]' : '';
  const clickClass = onClick && !hover ? 'cursor-pointer' : '';

  return (
    <Component
      onClick={onClick}
      style={style}
      className={`
        ${baseClass}
        ${hoverClass}
        ${selectedClass}
        ${clickClass}
        ${paddingClasses[padding]}
        ${className}
      `}
    >
      {children}
    </Component>
  );
};

export default Card;
