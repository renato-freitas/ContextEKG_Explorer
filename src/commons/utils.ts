export function print(text: any, value?: any) {
  console.log(`*** ${text.toUpperCase()} ***`, value ? value : "")
}