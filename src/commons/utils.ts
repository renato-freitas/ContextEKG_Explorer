export function printt(text: string, value?: any): void {
  console.log(`*** ${text.toUpperCase()} ***`, value ? value : "")
}

export function double_encode_uri(normal_uri:string){
  let decode_uri = encodeURIComponent(normal_uri)
  return encodeURIComponent(decode_uri)
}

export const changeBgColorCard = (idx: Number, selectedIndex: Number) => selectedIndex == idx ? "#edf4fc" : "None";


export function cutClassFromURI(uri:string|undefined){
  if(uri){
    let splitOne = uri?.split("/")
    let quantityOfTokens_1 = splitOne?.length
    let lastToken1 = splitOne[quantityOfTokens_1-1]
    let split2 = lastToken1.split("#")
    let quantityOfTokens_2 = split2?.length
    let lastToken2 = split2[quantityOfTokens_2-1]
    return lastToken2
  }
}

export function getcontextFromURI(uri:string|undefined){
  if(uri){
    let splitOne = uri?.split("/resource/")
    let lastToken1 = splitOne[1]
    
    let split2 = lastToken1.split("/")
    let lastToken2 = split2[0]
    return lastToken2
  }
}