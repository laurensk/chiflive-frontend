import { LiveEvent } from "../models/LiveEvent";
import { Message } from "../models/Message";
import { User } from "../models/User";
import { StorageUtils } from "../utils/StorageUtils";
import { ApiRequest } from "./ApiRequest";
import { ApiSuccess } from "./ApiSuccess.model";

export class ApiService {
  // Messages
  static async getAllMessages(callback: Function) {
    ApiRequest.post("/messages/get", {}, Message, true, true, (messages: Message[], error: ApiService) => {
      callback(messages, error);
    });
  }

  static async deleteMessage(messageId: number, callback: Function) {
    ApiRequest.post(
      "/messages/delete",
      { messageId: messageId },
      ApiSuccess,
      false,
      true,
      (success: ApiSuccess, error: ApiService) => {
        callback(success, error);
      }
    );
  }

  static async toggleReadStatus(messageId: number, callback: Function) {
    ApiRequest.post(
      "/messages/toggleReadStatus",
      { messageId: messageId },
      ApiSuccess,
      false,
      true,
      (success: ApiSuccess, error: ApiService) => {
        callback(success, error);
      }
    );
  }

  static async postMessage(author: string, body: string, callback: Function) {
    ApiRequest.post(
      "/messages",
      { author: author, body: body },
      ApiSuccess,
      false,
      false,
      (success: ApiSuccess, error: ApiService) => {
        console.log(error);
        callback(success, error);
      }
    );
  }

  // Properties
  static async getLiveEvent(callback: Function) {
    ApiRequest.post(
      "/properties/isLiveEvent",
      {},
      LiveEvent,
      false,
      false,
      (liveEvent: LiveEvent, error: ApiService) => {
        callback(liveEvent, error);
      }
    );
  }

  static async toggleLiveEvent(callback: Function) {
    ApiRequest.post(
      "/properties/toggleLiveEvent",
      {},
      ApiSuccess,
      false,
      true,
      (success: ApiSuccess, error: ApiService) => {
        callback(success, error);
      }
    );
  }

  // User
  static async login(username: string, password: string, callback: Function) {
    ApiRequest.post(
      "/user",
      { username: username, password: password },
      User,
      false,
      false,
      (user: User, error: ApiService) => {
        if (!error) StorageUtils.login(username, password, user.name);
        callback(user, error);
      }
    );
  }
}
