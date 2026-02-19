export function normalizeString(str: string): string {
    if (!str) return '';
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .trim();
}

export function slugify(str: string): string {
    return normalizeString(str)
        .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

export function generateKey(category: string, name: string): string {
    const normCategory = normalizeString(category || 'geral');
    const normName = normalizeString(name);
    return slugify(`${normCategory}-${normName}`);
}
