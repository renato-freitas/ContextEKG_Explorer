import { LOCAL_STORAGE } from "./constants";

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
    let lastToken2 = lastToken1
    if (lastToken1.includes("#")) {
      let split2 = lastToken1.split("#")
      let quantityOfTokens_2 = split2?.length
      lastToken2 = split2[quantityOfTokens_2 - 1].toString()
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

export function updateGlobalContext(object:any) {
  let _currentGlobalContext = window.localStorage.getItem(LOCAL_STORAGE.GLOBAL_CONTEXT) as string
  let updatedGlobalContext = {...JSON.parse(_currentGlobalContext), ...object}
  window.localStorage.setItem(LOCAL_STORAGE.GLOBAL_CONTEXT, JSON.stringify(updatedGlobalContext))
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
    let data = `${_y}-${_m}-${_d}`
    const hora = decodeURIComponent("T" + splitComHora)
    const asDate = new Date(data + hora)
    return asDate.toLocaleDateString("pt-BR") + " " + asDate.toLocaleTimeString()
  }
  return "";
}


export function getPatternsClassRDF2GlobalContext(arrayNewClass:any[]){
  let pattern_object_classRDF = {
    classURI: { type: 'url', value: arrayNewClass[0]},
    comment: { 'xml:lang': 'pt', type: 'literal', value: ''},
    label: { 'xml:lang': 'pt', type: 'literal', value: arrayNewClass[3]},
  }
  return pattern_object_classRDF
}