export function print_(text: string, value?: any): void {
  console.log(`*** ${text.toUpperCase()} ***`, value ? value : "")
}