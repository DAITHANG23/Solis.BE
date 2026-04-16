export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

export function keysToCamel(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(v => keysToCamel(v));
  }

  if (obj !== null && typeof obj === 'object') {
    if (obj instanceof Date) {
      return obj;
    }

    return Object.keys(obj).reduce(
      (result, key) => {
        const camelKey = snakeToCamel(key);
        result[camelKey] = keysToCamel(obj[key]);
        return result;
      },
      {} as Record<string, any>,
    );
  }

  return obj;
}
