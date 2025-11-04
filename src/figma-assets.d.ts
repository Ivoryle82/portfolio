declare module 'figma:asset/*.png' {
  const value: string;
  export default value;
}

declare module '*.png' {
  const value: string;
  export default value;
}

// Extend ImportMeta interface for Vite's import.meta.glob
interface ImportMeta {
  glob(pattern: string, options?: { eager?: boolean; import?: string }): Record<string, any>;
}

