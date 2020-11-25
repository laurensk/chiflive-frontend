import React from "react";
import "./Home.css";
import { ApiError } from "../../api/ApiError.model";
import { ApiService } from "../../api/ApiService";
import { ApiSuccess } from "../../api/ApiSuccess.model";
import { StorageUtils } from "../../utils/StorageUtils";
import { LiveEvent } from "../../models/LiveEvent";

interface StateType {
  author: string;
  body: string;
  isLiveEvent: boolean;
}

export class Home extends React.Component<any, StateType> {
  liveEventInterval: any;

  constructor(props: any) {
    super(props);
    this.state = {
      author: StorageUtils.getAuthorName(),
      body: "",
      isLiveEvent: true,
    };
  }

  componentDidMount() {
    this.updateLiveEvent();
    this.liveEventInterval = setInterval(() => this.updateLiveEvent(), 10000);
  }

  componentWillUnmount() {
    clearInterval(this.liveEventInterval);
  }

  updateLiveEvent() {
    ApiService.getLiveEvent((liveEvent: LiveEvent, error: ApiError) => {
      if (!error) this.setState({ isLiveEvent: liveEvent.isLiveEvent });
    });
  }

  sendMessage(event: any) {
    event.preventDefault();
    if (this.state.isLiveEvent) {
      ApiService.postMessage(this.state.author, this.state.body, (success: ApiSuccess, error: ApiError) => {
        if (error) return alert("Error sending message. Please try again!");
        this.setState({ body: "" });
        alert("Message sent successfully!");
      });
    } else {
      alert("You can only send messages during a live event. Please come back later!");
    }
  }

  authorChanged(event: any) {
    StorageUtils.saveAuthorName(event.target.value);
    this.setState({ author: event.target.value });
  }

  bodyChanged(event: any) {
    this.setState({ body: event.target.value });
  }

  render() {
    return (
      <div className="container">
        <h1 className="title">CHIFLIVE</h1>
        <h2 className="subtitle">ADD YOUR COMMENT TO CHIFLIVE NOW!</h2>
        <div className="form-container">
          <form className="form-element" onSubmit={(event) => this.sendMessage(event)}>
            <input
              className="author-input"
              placeholder="Author (optional)"
              type="text"
              value={this.state.author}
              onChange={(event) => this.authorChanged(event)}
            />
            <textarea
              className="body-input"
              placeholder="Your Message"
              value={this.state.body}
              onChange={(event) => this.bodyChanged(event)}
            />
            <button className="button-input" type="submit">
              Post Message
            </button>
          </form>
        </div>
      </div>
    );
  }
}
