import React, { Component } from "react";
import * as $ from "jquery";
class SequenceView extends Component {
  render() {
    return (
      <div className="scroll">
        <div className="barG" />
        <div id="acd" className="seqView" />
      </div>
    );
  }
}

export default SequenceView;
