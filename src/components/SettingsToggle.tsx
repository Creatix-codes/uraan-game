import { Icon, type IconName } from './Icon';

interface SettingsToggleProps {
  icon: IconName;
  title: string;
  description: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  accent?: 'green' | 'gold';
}

export function SettingsToggle({
  icon,
  title,
  description,
  checked,
  onChange,
  accent = 'green',
}: SettingsToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={title}
      className={`setting-row ${checked ? 'is-on' : ''} setting-row--${accent}`}
      onClick={() => onChange(!checked)}
    >
      <span className="setting-row__icon" aria-hidden="true">
        <Icon name={icon} size={23} strokeWidth={1.8} />
      </span>
      <span className="setting-row__copy">
        <span className="setting-row__title">{title}</span>
        <span className="setting-row__description">{description}</span>
      </span>
      <span className="switch" aria-hidden="true">
        <span className="switch__track">
          <span className="switch__thumb">
            <Icon name={checked ? 'check' : 'close'} size={12} strokeWidth={2.6} />
          </span>
        </span>
      </span>
    </button>
  );
}
