import React, { Component } from "react";
import Loader from "react-loader-spinner";

class AwesomeLoader extends Component {
  render() {
    return <Loader type="Bars" color="#00BFFF" height="100" width="100" />;
  }
}
export default AwesomeLoader;
