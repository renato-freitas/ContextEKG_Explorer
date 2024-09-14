import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { ClassModel } from '../models/ClassModel'
import { NUMBERS } from '../commons/constants'
import { I_Resources_Navigated } from './type'

export interface GlobalContextState {
  // A aplicação precisa dos seguintes atributos para identificar o atual contexto de exploração:
    // O idioma (pt, en), 
    // o tipo de visão (0==VU, 1==VE, 2==VF), 
    // o recurso (URI)
    // a classe (URI)
  language: string
  view: string
  exportedView?: string
  resourceURI: string
  initialResourceOfNavigation: string
  stack_of_resource_navigated: string[]
  stack_of_resources_navigated: I_Resources_Navigated[]
  index_of_context_menu: Number
  classRDF?: ClassModel
}

const initialState: GlobalContextState = {
  language: "pt",
  view: NUMBERS.CODE_OF_UNIFICATION_VIEW,
  resourceURI: "",
  initialResourceOfNavigation: "",
  stack_of_resource_navigated: [],
  stack_of_resources_navigated: [],
  index_of_context_menu: 0,
  classRDF: undefined,
  exportedView: ""
}

export const contextSlice = createSlice({
  name: 'globalContext',
  initialState,
  reducers: {
    updateLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload
    },
    updateView: (state, action: PayloadAction<string>) => {
      state.view = action.payload
    },
    updateExportedView: (state, action: PayloadAction<string>) => {
      state.exportedView = action.payload
    },
    updasteResourceURI: (state, action: PayloadAction<string>) => {
      state.resourceURI = action.payload
    },
    updateInitialResourceOfNavigation: (state, action: PayloadAction<string>) => {
      state.initialResourceOfNavigation = action.payload
    },
    update_index_context_menu: (state, action: PayloadAction<Number>) => {
      state.index_of_context_menu = action.payload
    },
    pushResourceInStackOfResourcesNavigated: (state, action: PayloadAction<string>) => {
      state.stack_of_resource_navigated.push(action.payload)
    },
    pushResourceInStack_ResourcesNavigated: (state, action: PayloadAction<I_Resources_Navigated>) => {
      state.stack_of_resources_navigated.push(action.payload)
    },
    removeResourceOfStackOfResourcesNavigated: (state) => {
      state.stack_of_resource_navigated.pop()
    },
    removeResourceOfStack_ResourcesNavigated: (state) => {
      state.stack_of_resources_navigated.pop()
    },
    cleanStackOfResourcesNavigated: (state) => {
      state.stack_of_resource_navigated = []
    },
    cleanStack_ResourcesNavigated: (state) => {
      state.stack_of_resources_navigated = []
    },
    updateClassRDF: (state, action: PayloadAction<ClassModel>) => {
      state.classRDF = action.payload
    },
    updateResourceAndView: (state, action: PayloadAction<{resource:string, view:string}>) => {
      state.resourceURI = action.payload.resource
      state.view = action.payload.view
    },
  },
})

// Action creators are generated for each case reducer function
export const { 
  updateLanguage, 
  updateView, 
  updateExportedView, 
  updasteResourceURI, 
  updateInitialResourceOfNavigation, 
  update_index_context_menu,
  pushResourceInStackOfResourcesNavigated,
  removeResourceOfStackOfResourcesNavigated, 
  cleanStackOfResourcesNavigated,
  pushResourceInStack_ResourcesNavigated,
  removeResourceOfStack_ResourcesNavigated,
  cleanStack_ResourcesNavigated,
  updateClassRDF, 
  updateResourceAndView } = contextSlice.actions

export default contextSlice.reducer