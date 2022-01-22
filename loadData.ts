import { readFileSync } from 'fs';
import { join } from 'path';

export const readLines = (file: string, stripEmpty = true) : string[] => readFileSync(join('./input/', file), 'utf-8')
  .split('\n')
  .filter((x) => !stripEmpty || x !== '');
