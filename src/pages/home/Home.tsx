import React from "react";
import "./Home.css";
import { ApiError } from "../../api/ApiError.model";
import { ApiService } from "../../api/ApiService";
import { ApiSuccess } from "../../api/ApiSuccess.model";
import { StorageUtils } from "../../utils/StorageUtils";

interface StateType {
  author: string;
  body: string;
}

export class Home extends React.Component<any, StateType> {
  constructor(props: any) {
    super(props);
    this.state = {
      author: StorageUtils.getAuthorName(),
      body: "",
    };
  }

  sendMessage(event: any) {
    event.preventDefault();
    console.log("tello");
    ApiService.postMessage(this.state.author, this.state.body, (success: ApiSuccess, error: ApiError) => {
      if (error) return alert("Error");
      this.setState({ body: "" });
    });
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
      <div>
        <h1>Welcome to ChifLive</h1>
        <h2>Add your comment to ChifLive now!</h2>
        <div>
          <form onSubmit={(event) => this.sendMessage(event)}>
            <label>
              Author:
              <input type="text" value={this.state.author} onChange={(event) => this.authorChanged(event)} />
            </label>
            <label>
              Body:
              <input type="text" value={this.state.body} onChange={(event) => this.bodyChanged(event)} />
            </label>
            <input type="submit" value="Submit" />
          </form>
        </div>
      </div>
    );
  }
}
