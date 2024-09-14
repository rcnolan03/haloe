// hooks/useColorScheme.ts

import {
  ColorSchemeName,
  useColorScheme as _useColorScheme,
} from "react-native";

// The default color scheme is 'light' if the hook is not available.
export function useColorScheme(): NonNullable<ColorSchemeName> {
  return _useColorScheme() ?? "light";
}
