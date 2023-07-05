export function printt(text: string, value?: any): void {
  console.log(`*** ${text.toUpperCase()} ***`, value ? value : "")
}