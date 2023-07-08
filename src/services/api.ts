import axios from "axios";
import { printt } from "../commons/utils";
// var pjson = require("../../package.json");
// https://testdriven.io/blog/developing-a-single-page-app-with-fastapi-and-vuejs/

export const api = axios.create({
  // withCredentials: true,
  baseURL: "http://localhost:8000"
  // headers: {
  // "Content-Type": "application/json",
  // Authorization: "Bearer " + localStorage.getItem('token')
  // }
});
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
      window.location.reload();
    } else if (error.response?.status === 404) {
      // throw new Error("Não encontrado");
      throw new Error(error.response.data);
    } else if (error.response?.status === 409) {
      throw new Error(error.response.data);
    } else if (error.response?.status === 500) {
      throw new Error(error?.response.data);
    } else if (error.response?.status === 504) {
      throw new Error("Tempo esgotado");
    } else {
      throw new Error("Erro desconhecido");
    }
  }
);

api;