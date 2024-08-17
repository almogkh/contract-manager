import { createHash } from 'node:crypto';

export function computeHash(password: string): string {
    const hash = createHash('sha256');
    hash.update(password);
    return hash.digest().toString('hex');
}
