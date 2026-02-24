export function required(value: string) {
  return value?.trim().length > 0;
}

export function emailValid(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function phoneValid(value: string) {
  return /^\+?[1-9]\d{7,14}$/.test(value.replace(/\s/g, ""));
}
