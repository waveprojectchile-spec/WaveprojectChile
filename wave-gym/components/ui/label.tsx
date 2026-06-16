import React from 'react';
import { cn } from './input';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "text-xs font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 uppercase tracking-widest text-neutral-300",
          className
        )}
        {...props}
      />
    )
  }
)
Label.displayName = "Label"

export { Label }
