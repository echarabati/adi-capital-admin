'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

type Theme = 'light' | 'midnight' | 'dark';

const themeIcons: Record<Theme, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  light: Sun,
  midnight: Moon,
  dark: Monitor,
};

const themeLabels: Record<Theme, string> = {
  light: 'Claro',
  midnight: 'Medianoche',
  dark: 'Oscuro',
};

const THEME_ORDER: Theme[] = ['light', 'midnight', 'dark'];

interface ThemeToggleProps {
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ThemeToggle({ showLabel = false, size = 'md' }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch - only render after mount
  // eslint-disable-next-line -- intentional SSR pattern
  useEffect(() => void setMounted(true), []);

  const currentTheme = (theme as Theme) || 'midnight';
  const Icon = themeIcons[currentTheme];

  const cycleTheme = () => {
    const currentIndex = THEME_ORDER.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % THEME_ORDER.length;
    setTheme(THEME_ORDER[nextIndex]);
  };

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  // Render placeholder with same dimensions during SSR
  if (!mounted) {
    return (
      <button className="flex items-center gap-2 rounded-full p-2" disabled>
        <div className={sizeClasses[size]} />
      </button>
    );
  }

  return (
    <button
      onClick={cycleTheme}
      className="text-foreground hover:bg-secondary focus-ring flex items-center gap-2 rounded-full p-2 transition-colors"
      aria-label={`Cambiar tema (actual: ${themeLabels[currentTheme]})`}
      title={`Tema: ${themeLabels[currentTheme]}`}
    >
      <Icon className={sizeClasses[size]} />
      {showLabel && <span className="text-sm">{themeLabels[currentTheme]}</span>}
    </button>
  );
}

// Dropdown version for settings pages
export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const currentTheme = (theme as Theme) || 'midnight';

  const themes: {
    value: Theme;
    label: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  }[] = [
    { value: 'light', label: 'Claro', icon: Sun },
    { value: 'midnight', label: 'Medianoche', icon: Moon },
    { value: 'dark', label: 'Oscuro', icon: Monitor },
  ];

  return (
    <div className="flex gap-2">
      {themes.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            currentTheme === value
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:opacity-80'
          }`}
        >
          <Icon className="h-4 w-4" />
          {label}
        </button>
      ))}
    </div>
  );
}
