export function isEmail(v) {
  return /\S+@\S+\.\S+/.test(v)
}

export function isNonEmpty(v) {
  return String(v || '').trim().length > 0
}
