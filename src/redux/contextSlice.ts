import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { NUMBERS } from '../commons/constants'

export interface ContextState {
  // A aplicação precisa dos seguintes atributos para identificar o atual contexto de exploração:
    // O idioma (pt, en), 
    // o tipo de visão (0==VU, 1==VE, 2==VF), 
    // o recurso (URI)
    // a classe (URI)
  language: string
  typeOfView: string
  resourceUri: string
  classeUri: string
  exportedSemanticView?: string
}

const initialState: ContextState = {
  language: "pt",
  typeOfView: NUMBERS.CODE_UNIFICATION_VIEW,
  resourceUri: "",
  classeUri: "",
  exportedSemanticView: ""
}

export const contextSlice = createSlice({
  name: 'context',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<ContextState>) => {
      state.language = action.payload.language
    },
    setTypeOfView: (state, action: PayloadAction<ContextState>) => {
      state.typeOfView = action.payload.typeOfView
    },
    setResourceUri: (state, action: PayloadAction<ContextState>) => {
      state.resourceUri = action.payload.resourceUri
    },
  },
})

// Action creators are generated for each case reducer function
export const { setLanguage, setTypeOfView, setResourceUri } = contextSlice.actions

export default contextSlice.reducer