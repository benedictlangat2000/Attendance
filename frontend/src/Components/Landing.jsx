import React, { Component } from "react";
import '../css/Landing.css'; // Correct path to your CSS file
import Navbar from "./Navbar";
import { Link } from "react-router-dom";


export default class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: new Date()
    };
  }

  componentDidMount() {
    this.timerId = setInterval(() => {
      this.setState({
        time: new Date()
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerId);
  }

  formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  render() {
    const { time } = this.state;
    const hours = time.getHours() % 12; // 12-hour format
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    
    const hourDegrees = (hours * 30) + (minutes / 2);
    const minuteDegrees = minutes * 6;
    const secondDegrees = seconds * 6;

    return (
      <div className="clock-container">
        <div className="admin-column">
        <Navbar />     
        </div>
        <div className="column ml-5">
            <Link to="/Start" className="loginbutton">Login</Link>
        </div>
        <div className="column clock-column">
          <div className="clock">
            <div
              className="hour_hand"
              style={{ transform: `rotateZ(${hourDegrees}deg)` }}
            />
            <div
              className="min_hand"
              style={{ transform: `rotateZ(${minuteDegrees}deg)` }}
            />
            <div
              className="sec_hand"
              style={{ transform: `rotateZ(${secondDegrees}deg)` }}
            />
            <span className="twelve">12</span>
            <span className="one">1</span>
            <span className="two">2</span>
            <span className="three">3</span>
            <span className="four">4</span>
            <span className="five">5</span>
            <span className="six">6</span>
            <span className="seven">7</span>
            <span className="eight">8</span>
            <span className="nine">9</span>
            <span className="ten">10</span>
            <span className="eleven">11</span>
          </div>
        </div>
        <div className="column time-column">
          <div className="time-digits">
            <div className="time">{this.formatTime(time)}</div>
            <div className="date">{this.formatDate(time)}</div>
          </div>
        </div>
      </div>
    );
  }
}
