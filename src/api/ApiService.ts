import { LiveEvent } from "../models/LiveEvent";
import { Message } from "../models/Message";
import { User } from "../models/User";
import { StorageUtils } from "../utils/StorageUtils";
import { ApiRequest } from "./ApiRequest";
import { ApiSuccess } from "./ApiSuccess.model";

export class ApiService {
  // Messages
  static async getAllMessages(messageId: number, callback: Function) {
    ApiRequest.get("/messages", {}, Message, true, true, (messages: Message[], error: ApiService) => {
      callback(messages, error);
    });
  }

  static async deleteMessage(messageId: number, callback: Function) {
    ApiRequest.delete("/messages", { messageId: messageId }, true, (success: ApiSuccess, error: ApiService) => {
      callback(success, error);
    });
  }

  static async toggleReadStatus(messageId: number, callback: Function) {
    ApiRequest.post(
      "/messages/toggleReadStatus",
      { messageId: messageId },
      ApiSuccess,
      false,
      false,
      (success: ApiSuccess, error: ApiService) => {
        callback(success, error);
      }
    );
  }

  static async postMessage(author: string, body: string, callback: Function) {
    console.log("here");
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
    ApiRequest.get(
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
    ApiRequest.get("/user", {}, User, false, true, (user: User, error: ApiService) => {
      StorageUtils.login(username, password);
      callback(user, error);
    });
  }
}
