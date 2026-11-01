import type { StackLine, Tech } from '../../content/types';

export const techLabel = ({ name, detail }: Tech) =>
  detail ? `${name} [${detail}]` : name;

export const lineLabel = (line: StackLine) => line.map(techLabel).join(', ');
