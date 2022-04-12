import React, { Component } from "react";
import axios from "axios";
import $ from "jquery";

export default class Calendly extends Component {

  //Functions
  validate = (nameToCheck) => {
    if (nameToCheck) {
      return nameToCheck;
    } else {
      return "";
    }
  };

  postAbandon = (payload) => {
    const url = this.props.abandonTrackerEndpoint + "?e=" + this.props.email;

    $.ajax({
      type: "GET",
      url: url,
      success: (result) => {},
      error: (result, status) => {},
    });
  };

  postData = (payload, uuid) => {
    const auth = "Bearer " + this.props.calendlyAuth;
    const opt1 = {
      method: "GET",
      url: "https://api.calendly.com/users/" + uuid,
      headers: {
        "Content-Type": "application/json",
        Authorization: auth,
      },
    };

    const opt2 = {
      method: "GET",
      url: payload.invitee.uri,
      headers: {
        "Content-Type": "application/json",
        Authorization: auth,
      },
    };

    const requestOne = axios.request(opt1);
    const requestTwo = axios.request(opt2);

    axios
      .all([requestOne, requestTwo])
      .then(
        axios.spread((...responses) => {
          //const host_email = responses[0].data.resource.email;
          //const to_email = responses[1].data.resource.email;
          const event_uuid = payload.event.uri;
          const invitee_uuid = payload.invitee.uri;

          window.parent.postMessage(
            {
              event_id: "smpldv_message",
              data: {
                //host_event_uri: host_event_uri,
                //host_email: host_email,
                //to_email: to_email,
                event_uuid: event_uuid,
                invitee_uuid: invitee_uuid,
              },
            },
            "*"
          );
        })
      )
      .catch((errors) => {
        console.error(errors);
      });
  };

  getEvents = (payload) => {
    const auth = "Bearer " + this.props.calendlyAuth;
    const options = {
      method: "GET",
      url: payload.event.uri,
      headers: {
        "Content-Type": "application/json",

        Authorization: auth,
      },
    };

    axios
      .request(options)
      .then((response) => {
        var uuid = response.data.resource.event_memberships[0].user.replace(
          "https://api.calendly.com/users/",
          ""
        );

        this.postData(payload, uuid);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  processMessage = (e) => {
    if (e.data.event && e.data.event.indexOf("calendly") === 0) {
      let s = e.data;
      switch (s.event) {
        case "calendly.date_and_time_selected":
          break;
        case "calendly.event_scheduled":
          this.props.finishSchedule();
          break;
        default:
          break;
      }
    }
  };

  getHost = () => {
    var axios = require("axios").default;
    var uri = this.props.calendlyAuth;
    if (uri.length > 0) {
      var options = {
        method: "GET",
        url: "https://api.calendly.com/users/me",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + uri,
        },
      };

      axios
        .request(options)
        .then((response) => {
          this.props.setHost(response.data.resource.uri);
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  };

  componentDidMount() {
    const head = document.querySelector("head");
    const script = document.createElement("script");

    script.setAttribute(
      "src",
      "https://assets.calendly.com/assets/external/widget.js"
    );
    head.appendChild(script);

    window.addEventListener("message", this.processMessage);
  }

    //Variables
    url =
    this.props.calendlyHostLink +
    "?email=" +
    this.validate(this.props.email) +
    "&name=" +
    this.validate(this.props.name) +
    "&hide_gdpr_banner=1";

  componentDidUpdate() {

    this.getHost();
    this.postAbandon();

    this.url =
      this.props.calendlyHostLink +
      "?email=" +
      this.validate(this.props.email) +
      "&name=" +
      this.validate(this.props.name) +
      "&hide_gdpr_banner=1";
  }

  componentWillUnmount() {
    // whatever you need to cleanup the widgets code
    window.removeEventListener("message", this.processMessage);
  }

  //Calendly Template
  render() {
    return (
      <div
        className="calendly-inline-widget"
        data-url={this.url}
        style={{ height: "100vh" }}
      />
    );
  }
}
