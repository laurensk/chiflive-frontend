import Axios, { AxiosResponse } from "axios";
import { ApiError } from "./ApiError.model";
import { ApiSuccess } from "./ApiSuccess.model";
import { StorageUtils } from "../utils/StorageUtils";

export class ApiRequest {
  static apiEndpoint: string = "http://localhost:8081";

  static async responseHandler(response: AxiosResponse<any>, parseType: any, isArray: boolean, callback: Function) {
    const rawData = Object.values(response.data)[0];
    const data = isArray ? (rawData as typeof parseType) : (rawData as typeof parseType[]);
    callback(data, null);
  }

  static async errorHandler(error: any, callback: Function) {
    if (!error || !error.response || !error.response.data) return callback(null, new ApiError("UNKNOWN_ERROR", 400));
    if (error.response.data.error.message != undefined) {
      const statusCode: number = error.response.data.error.statusCode;
      const message: string = error.response.data.error.message;
      const apiError = new ApiError(message, statusCode);
      return callback(null, apiError);
    } else {
      const apiError = new ApiError("UNKNOWN_ERROR", 400);
      return callback(null, apiError);
    }
  }

  static async get(path: string, body: object, parseType: any, isArray: boolean, auth: boolean, callback: Function) {
    const reqUrl = this.apiEndpoint + path;
    const reqBody: Object = auth ? { ...StorageUtils.getLoginData(), ...body } : body;
    Axios.get(reqUrl, { data: reqBody })
      .then((res) => this.responseHandler(res, parseType, isArray, callback))
      .catch((err) => this.errorHandler(err, callback));
  }

  static async post(path: string, body: object, parseType: any, isArray: boolean, auth: boolean, callback: Function) {
    const reqUrl = this.apiEndpoint + path;
    const reqBody: Object = auth ? { ...StorageUtils.getLoginData(), ...body } : body;
    Axios.post(reqUrl, reqBody)
      .then((res) => this.responseHandler(res, parseType, isArray, callback))
      .catch((err) => this.errorHandler(err, callback));
  }

  static async delete(path: string, body: object, auth: boolean, callback: Function) {
    const reqUrl = this.apiEndpoint + path;
    const reqBody: Object = auth ? { ...StorageUtils.getLoginData(), ...body } : body;
    Axios.delete(reqUrl, { data: reqBody })
      .then((res) => this.responseHandler(res, ApiSuccess, false, callback))
      .catch((err) => this.errorHandler(err, callback));
  }
}
