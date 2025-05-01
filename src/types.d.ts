declare module 'node-clipboard' {
  export function write(text: string): void;
  export function read(): string;
} 