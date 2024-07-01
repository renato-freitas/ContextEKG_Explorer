import { Repositories } from "../view/config/Repositories";

export function printt(text: string, value?: any): void {
  console.log(`*** ${text.toUpperCase()} ***`, value ? value : "")
}

export function double_encode_uri(normal_uri: string) {
  let decode_uri = encodeURIComponent(normal_uri)
  return encodeURIComponent(decode_uri)
}

export const changeBgColorCard = (idx: Number, selectedIndex: Number) => selectedIndex == idx ? "#edf4fc" : "None";


export function getPropertyFromURI(uri: string | undefined): string {
  if (uri) {
    let splitOne = uri?.split("/")
    let quantityOfTokens_1 = splitOne?.length
    let lastToken1 = splitOne[quantityOfTokens_1 - 1]
    // console.log(`1º split >>>`, lastToken1)
    let lastToken2 = lastToken1
    if (lastToken1.includes("#")) {
      let split2 = lastToken1.split("#")
      let quantityOfTokens_2 = split2?.length
      lastToken2 = split2[quantityOfTokens_2 - 1].toString()
      // console.log(`2º split >>>`, lastToken2)
    }
    return lastToken2;
  }
  return "";
}

export function getContextFromURI(uri: string): string {
  let lastToken2: string = ""
  if (uri) {
    let splitOne = uri.split("/resource/")
    let lastToken1 = splitOne[1]

    let split2 = lastToken1.split("/")
    lastToken2 = split2[0]
  }
  return lastToken2
}

export function getClassFromURI(uri: string): string {
  if (uri) {
    let splitOne = uri?.split("/")
    let quantityOfTokens_1 = splitOne?.length
    let lastToken1 = splitOne[quantityOfTokens_1 - 2]
    return `${lastToken1}`;
  }
  return "";
}

export function getClassAndIdentifierFromURI(uri: string): string {
  if (uri) {
    let splitOne = uri?.split("/")
    let quantityOfTokens_1 = splitOne?.length
    let lastToken1 = splitOne[quantityOfTokens_1 - 2]
    let lastToken2 = splitOne[quantityOfTokens_1 - 1]

    return `${lastToken1}/${lastToken2}`;
  }
  return "";
}

// FUNÇÕES SPARQL
// function canonicalUri(uri){
//   tokens = uri.split("/")
//   if (tokens.length < 2) return false
//   return "http://www.arida.ufc.br/resource/canonical/"+tokens[tokens.length - 2]+"/"+tokens[tokens.length - 1]
// }

// function getContext(uri) {
//   split2 = uri.split("/resource/")[1].split("/")
//   if (split2.length < 2) return false
//   return split2[0]
// }

function compareSize( a:string[], b:string[] ) {
  if ( a.length < b.length ){
    return -1;
  }
  if ( a.length > b.length ){
    return 1;
  }
  return 0;
}

// export function fusionOfName(str1:string, str2:string, str3:string, str4:string){
//   let m = []
//   if (str1 != "") m.push(str1.split(" "))
//   if (str2 != "") m.push(str2.split(" "))
//   if (str3 != "") m.push(str3.split(" "))
//   if (str4 != "") m.push(str4.split(" "))

//   let menor = m.sort( compareSize )[0];

//   // let out = menor.filter((word) => {
//   //   function match(currentValue:string[]) { return currentValue.includes(word) }
//   //   if (m.slice(1).every(match) == true) return word
//   //   else return false
//   // })
//   return menor.join(" ")
// }

function fusionOfName(prov:string, p:string, o:string){
  if (prov == "MusicBrainz" && p == "foaf:name") return o
}

export function getIdentifierFromURI(uri: string): string {
  if (uri) {
    let splitOne = uri?.split("/")
    let quantityOfTokens_1 = splitOne?.length
    let lastToken2 = splitOne[quantityOfTokens_1 - 1]

    return `${lastToken2}`;
  }
  return "";
}

export function getAppHigienizadoFromClasse(uri: string): string {
  const classe = getClassFromURI(uri)
  const id = getIdentifierFromURI(uri)
  switch (classe) {
    case 'Estabelecimento':
      return `http://www.sefaz.ma.gov.br/resource/AppEndereco/Estabelecimento/${id}`
    case 'Empresa':
      return `http://www.sefaz.ma.gov.br/resource/AppEndereco/Empresa${id}`
    default:
      return "";
  }
}

export function setContextLocalStorage(context: string): void {
  localStorage.setItem('context', context)
}

export function getContextLocalStorage(): string {
  return localStorage.getItem('context') || ""
}


export function setRepositoryLocalStorage(repository: string): void {
  window.localStorage.setItem('repository', repository)
}

export function getsetRepositoryLocalStorage(): string {
  return window.localStorage.getItem('repository') || ""
}

export function setTypeClassLocalStorage(typeClass: string): void {
  localStorage.setItem('typeClass', typeClass)
}

export function getTypeOfClassOnLocalStorage(): string {
  return localStorage.getItem('typeClass') || ""
}


export function getDateFromInstantTimelin(instantURI: string): string {
  if (instantURI) {
    let lastToken1 = instantURI?.split("/Instant/")[1]
    /** NÃO PODE USAR SPLIT("-"). TEM ID QUE USA "-" */ 
    // let split2 = lastToken1.split("-") 
    
    const splitComAno = lastToken1.split('T')[0].split("-")
    const splitComHora = lastToken1.split('T')[1]
    const _d = splitComAno[splitComAno.length - 1]
    const _m = splitComAno[splitComAno.length - 2]
    const _y = splitComAno[splitComAno.length - 3]
    // console.log('PARTE QUE TEM A DATA DO INSTANTE', splitComAno, _y, _m,_d, splitComHora)
    let data = `${_y}-${_m}-${_d}`
    const hora = decodeURIComponent("T" + splitComHora)
    const asDate = new Date(data + hora)
    return asDate.toLocaleDateString("pt-BR") + " " + asDate.toLocaleTimeString()
  }
  return "";
}