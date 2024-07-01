import axios from "axios";
import { getsetRepositoryLocalStorage, printt } from "../commons/utils";
// var pjson = require("../../package.json");
// https://testdriven.io/blog/developing-a-single-page-app-with-fastapi-and-vuejs/

export const api = axios.create({
  // withCredentials: true,
  baseURL: "http://localhost:8000",
  // headers: {
  //   "repo": localStorage.getItem("repository") as string
  // }
});
api.defaults.headers.common["repo"] =  localStorage.getItem("repository") as string;
api.defaults.headers.common["Authorization"] = "Bearer " + localStorage.getItem("token");
api.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

api.interceptors.response.use(
  function (response) {
    if (response.data.status_code === 409) {
      throw new Error(response.data.detail);
    }
    else {
      return response;
    }
  },
  function (error) {
    if (!error.response) {
      throw new Error("Servidor não disponível");
    } else if (error.response?.status === 400) {
      throw new Error("Solicitação incorreta");
    } else if (error.response?.status === 401) {
      // throw new Error("Acesso não autorizado");
      throw new Error(error.response?.data);
    } else if (error.response?.status === 403) {
      api.defaults.headers.common["Authorization"] = "Bearer " + localStorage.getItem("token");
      window.location.reload();
    } else if (error.response?.status === 404) {
      api.defaults.headers.common["Authorization"] = "Bearer " + localStorage.getItem("token");
      // throw new Error("Não encontrado");
      throw new Error(error.response.data);
    } else if (error.response?.status === 409) {
      throw new Error(error.response.data);
    } else if (error.response?.status === 500) {
      throw new Error(error?.response.data);
    } else if (error.response?.status === 504) {
      throw new Error("Tempo esgotado");
    } else {
      api.defaults.headers.common["Authorization"] = "Bearer " + localStorage.getItem("token");
      throw new Error("Erro desconhecido");
    }
  }
);

// api.interceptors.request.use((config) => {
//   config.headers = Object.assign({
//     'repo': localStorage.getItem("repository") as string
//   }, config.headers)
// })

api ;