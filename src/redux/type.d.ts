interface IContext {
  context: string
}

type ArticleState = {
  payload: IContext[]
}

type ArticleAction = {
  type: string
  payload: IContext
}

type DispatchType = (args: ArticleAction) => ArticleAction


export interface I_Resources_Navigated {
  resource: string;
  idx_menu_context: Number;
}