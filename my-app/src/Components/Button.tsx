import { forwardRef, ComponentPropsWithoutRef } from "react";

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props}, ref) => {
    const baseStyle = `btn btn-${variant} btn-${size} ${className || ''}`;

    return (
			<button ref={ref} className={baseStyle} {...props}>
				{children}
			</button>
  	);
  }
);

Button.displayName = 'Button';