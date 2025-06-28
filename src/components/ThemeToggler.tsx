import React from 'react'
import { useTheme } from "./theme-provider";

import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';

const ThemeToggler = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button variant="ghost" size="sm" onClick={toggleTheme}>
      {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </Button>
  )
}

export default ThemeToggler