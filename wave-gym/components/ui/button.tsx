import React from 'react';
import { cn } from './input';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: "bg-white text-black hover:bg-neutral-200",
      outline: "border border-neutral-800 text-white hover:bg-neutral-900",
      ghost: "text-neutral-400 hover:text-white"
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center h-12 px-8 text-sm font-bold uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-700 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
