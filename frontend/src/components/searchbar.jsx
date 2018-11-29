import React, { Component } from "react";
import * as $ from "jquery";
import * as d3 from "d3";
import App from "../App";
class SearchBar extends Component {
  render() {
    return (
      <form className="form-inline my-2 my-sm m-2">
        <input
          id="srch"
          style={{
            height: 25,
            width: 70,
            fontSize: 10
          }}
          className="form-control form-control-sm"
          type="search"
          placeholder="Search"
          aria-label="Search"
        />
        <button
          id="srchBtn"
          style={{
            height: 25,
            fontSize: 10
          }}
          name={this.props.BarName}
          className="btn btn-outline-primary btn-sm m-2"
          type="button"
          onClick={() =>
            this.props.startSearch(this.props.eventMaps, this.props.pats)
          }
        >
          {this.props.BarName}
        </button>
      </form>
    );
  }
}

export default SearchBar;
