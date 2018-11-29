import React, { Component } from "react";
import * as d3 from "d3";
class CheckBox extends Component {
  onChanged(e) {
    var x = d3.select(".seqView").select("svg");
    if (e.target.checked) {
      x.selectAll(".isKey").style("stroke", "black");
    } else {
      x.selectAll(".isKey").style("stroke", null);
    }
  }
  render() {
    return (
      <div className="form-check chkBx">
        <label className="form-check-label chkBxLbl" htmlFor="defaultCheck1 ">
          {this.props.CheckBoxName}
        </label>
        <input
          className="form-check-input"
          type="checkbox"
          value=""
          onChange={this.onChanged}
          id="defaultCheck1"
        />
      </div>
    );
  }
}

export default CheckBox;
