import { readFileSync } from 'fs';
import { join } from 'path';

export const readLines = (file: string) : string[] => readFileSync(join('./input/', file), 'utf-8')
  .split('\n')
  .filter((x) => x !== '');
