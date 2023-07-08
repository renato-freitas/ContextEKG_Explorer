export function printt(text: string, value?: any): void {
  console.log(`*** ${text.toUpperCase()} ***`, value ? value : "")
}

export function double_encode_uri(normal_uri:string){
  let decode_uri = encodeURIComponent(normal_uri)
  return encodeURIComponent(decode_uri)
}