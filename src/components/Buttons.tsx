import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Icon, type IconName } from './Icon';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'lg' | 'md' | 'sm';

interface PaintedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  trailingIcon?: IconName;
  fullWidth?: boolean;
  children: ReactNode;
}

export function PaintedButton({
  variant = 'primary',
  size = 'md',
  icon,
  trailingIcon,
  fullWidth = false,
  className = '',
  children,
  type = 'button',
  ...props
}: PaintedButtonProps) {
  return (
    <button
      type={type}
      className={[
        'painted-btn',
        `painted-btn--${variant}`,
        `painted-btn--${size}`,
        fullWidth ? 'painted-btn--full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      <span className="painted-btn__sheen" aria-hidden="true" />
      {icon ? (
        <span className="painted-btn__icon" aria-hidden="true">
          <Icon name={icon} size={size === 'lg' ? 24 : 19} strokeWidth={2.1} />
        </span>
      ) : null}
      <span className="painted-btn__label">{children}</span>
      {trailingIcon ? (
        <span className="painted-btn__icon painted-btn__icon--trailing" aria-hidden="true">
          <Icon name={trailingIcon} size={size === 'lg' ? 22 : 18} strokeWidth={2.1} />
        </span>
      ) : null}
    </button>
  );
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconName;
  label: string;
  variant?: 'dark' | 'cream' | 'gold' | 'danger';
  size?: 'md' | 'sm';
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  {
    icon,
    label,
    variant = 'cream',
    size = 'md',
    className = '',
    type = 'button',
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={[
        'icon-btn',
        `icon-btn--${variant}`,
        `icon-btn--${size}`,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={label}
      title={label}
      {...props}
    >
      <Icon name={icon} size={size === 'md' ? 22 : 18} strokeWidth={2} />
    </button>
  );
});
