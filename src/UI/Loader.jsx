import React, { Component } from 'react';

export default class Loader extends Component {
  render() {
    return <div className="centric-overlay">
      <div className="loader"></div>
    </div>;
  }
}
