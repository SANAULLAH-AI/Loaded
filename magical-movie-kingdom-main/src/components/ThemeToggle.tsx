
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  isDarkMode,
  onToggleTheme,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Sun className="h-4 w-4" />
      <Switch 
        checked={isDarkMode} 
        onCheckedChange={onToggleTheme}
        id="theme-toggle"
      />
      <Label htmlFor="theme-toggle" className="cursor-pointer">
        <Moon className="h-4 w-4" />
      </Label>
    </div>
  );
};

export default ThemeToggle;
