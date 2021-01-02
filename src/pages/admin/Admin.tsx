import React from "react";
import "./Admin.css";
import { StorageUtils } from "../../utils/StorageUtils";
import { ApiService } from "../../api/ApiService";
import { ApiError } from "../../api/ApiError.model";
import { User } from "../../models/User";
import { Message } from "../../models/Message";
import { ApiSuccess } from "../../api/ApiSuccess.model";
import { LiveEvent } from "../../models/LiveEvent";

interface StateType {
  isLoggedIn: boolean;
  username: string;
  password: string;
  user: User | undefined;
  messages: Message[];
  sec: number;
  isLiveEvent: boolean;
}

export class Admin extends React.Component<any, StateType> {
  interval: any | undefined;
  adminLiveEventInterval: any;

  constructor(props: any) {
    super(props);
    this.state = {
      isLoggedIn: StorageUtils.isLoggedIn(),
      username: "",
      password: "",
      user: undefined,
      messages: [],
      sec: 5,
      isLiveEvent: true,
    };
  }

  componentDidMount() {
    this.getMessages(false);
    document.body.style.backgroundImage = "none";
    this.interval = setInterval(() => this.getMessages(false), 1000);
    this.updateLiveEvent();
    this.adminLiveEventInterval = setInterval(() => this.updateLiveEvent(), 10000);
    //StorageUtils.logout();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    clearInterval(this.adminLiveEventInterval);
  }

  updateLiveEvent() {
    ApiService.getLiveEvent((liveEvent: LiveEvent, error: ApiError) => {
      if (!error) this.setState({ isLiveEvent: liveEvent.isLiveEvent });
    });
  }

  toggleLiveEvent() {
    ApiService.toggleLiveEvent((success: ApiSuccess, error: ApiError) => {
      if (!error) this.updateLiveEvent();
    });
  }

  login(event: any) {
    event.preventDefault();
    ApiService.login(this.state.username, this.state.password, (user: User, error: ApiError) => {
      if (error) {
        console.log(error);
        this.setState({ isLoggedIn: false, password: "" });
        alert("Login failed. Please try again!");
      } else {
        this.setState({ user: user, isLoggedIn: StorageUtils.isLoggedIn(), username: "", password: "" });
      }
    });
  }

  renderLogin() {
    return (
      <div className="admin-container">
        <h1 className="admin-title">CHIFLIVE</h1>
        <h2 className="admin-subtitle">LOGIN TO MANAGE MESSAGES!</h2>
        <div className="admin-form-container">
          <form className="admin-form-element" onSubmit={(event) => this.login(event)}>
            <input
              className="admin-input"
              placeholder="Username"
              type="text"
              value={this.state.username}
              onChange={(event) => this.setState({ username: event.target.value })}
            />
            <input
              className="admin-input"
              placeholder="Password"
              type="password"
              value={this.state.password}
              onChange={(event) => this.setState({ password: event.target.value })}
            />
            <button className="admin-button" type="submit">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  getMessages(now: boolean) {
    if ((this.state.isLoggedIn && this.state.sec >= 5) || now) {
      ApiService.getAllMessages((messages: Message[], error: ApiError) => {
        if (!error) this.setState({ messages: this.sortMessages(messages), sec: 0 });
      });
    } else {
      this.setState({ sec: this.state.sec + 1 });
    }
  }

  sortMessages(messages: Message[]) {
    return messages.sort((x, y) => Number(x.read) - Number(y.read));
  }

  renderAdmin() {
    return (
      <div className="admin-container">
        <h1 className="admin-title">CHIFLIVE</h1>
        <h2 className="admin-subtitle">Welcome, {StorageUtils.getName()}</h2>
        <h2
          onClick={() => this.toggleLiveEvent()}
          style={{ textDecoration: "underline", cursor: "pointer", marginTop: 5 }}
          className="admin-subtitle"
        >
          Turn LiveEvent {this.state.isLiveEvent ? "OFF" : "ON"}
        </h2>
        <h2
          onClick={() => {
            StorageUtils.logout();
            this.setState({ isLoggedIn: false });
          }}
          style={{ textDecoration: "underline", cursor: "pointer" }}
          className="admin-subtitle"
        >
          Logout
        </h2>
        <div className="mes-container">
          {this.state.messages.map((message) => {
            return this.renderMessage(message);
          })}
          <div className="updated-sec">Updated {this.state.sec} seconds ago...</div>
        </div>
      </div>
    );
  }

  toggleRead(message: Message) {
    ApiService.toggleReadStatus(message.id, (success: ApiSuccess, error: ApiError) => {
      if (!error) this.getMessages(true);
    });
  }

  deleteMessage(message: Message) {
    ApiService.deleteMessage(message.id, (success: ApiSuccess, error: ApiError) => {
      if (!error) this.getMessages(true);
    });
  }

  renderMessage(message: Message) {
    return (
      <div key={message.id} className="mes-message-container" style={message.read ? { opacity: 0.5 } : undefined}>
        <div className="message-detail">
          <div className="mes-author">{message.author.length > 0 ? message.author : "No Author"}</div>
          <div className="mes-body">{message.body}</div>
        </div>
        <div className="admin-buttons">
          <button onClick={() => this.toggleRead(message)} className="action-button">
            {message.read ? "Mark as Unread" : "Mark as Read"}
          </button>
          <button onClick={() => this.deleteMessage(message)} className="action-button">
            Delete
          </button>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.state.isLoggedIn && this.renderAdmin()}
        {!this.state.isLoggedIn && this.renderLogin()}
      </div>
    );
  }
}
