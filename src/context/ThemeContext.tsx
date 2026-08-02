import { createContext } from 'react';

import type { ThemeContextValue } from '../types/index.type';

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

