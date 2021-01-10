export function between(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function either(left: string, right: string) {
  return Math.random() < 0.5 ? left : right
}