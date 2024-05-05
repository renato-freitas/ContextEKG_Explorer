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
  if (uri) {
    let splitOne = uri?.split("/resource/")
    let lastToken1 = splitOne[1]

    let split2 = lastToken1.split("/")
    let lastToken2: string
    lastToken2 = split2[0]
    return lastToken2
  }
  return "";
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
  localStorage.setItem('repository', repository)
}

export function getsetRepositoryLocalStorage(): string {
  return localStorage.getItem('repository') || ""
}

export function setTypeClassLocalStorage(typeClass: string): void {
  localStorage.setItem('typeClass', typeClass)
}

export function getsetTypeClassLocalStorage(): string {
  return localStorage.getItem('typeClass') || ""
}


export function getDateFromInstantTimelin(instantURI: string): string {
  if (instantURI) {
    let splitOne = instantURI?.split("/Instant/")
    let lastToken1 = splitOne[1]

    let split2 = lastToken1.split("-")
    console.log('DATA DO INSTANTE', split2)
    let lastToken2: string
    lastToken2 = decodeURIComponent(`${split2[1]}-${split2[2]}-${split2[3]}`)
    return lastToken2
  }
  return "";
}