import React, { Component } from "react";
import ReactDOM from "react-dom";
import * as d3 from "d3";
import D3Funnel from "d3-funnel";
import * as $ from "jquery";
import AwesomeLoader from "./awesomeLoader";
import App from "../App";
class PatternView extends Component {
  state = {
    appendSeqView: false
  };
  getId() {
    return "funnel" + this.props.posLeft;
  }
  componentDidMount() {
    const { data } = this.props;
    const chart = new D3Funnel("#" + this.getId());
    chart.draw(data.datas, data.options);
  }

  appendSequenceView(
    eventMaps,
    supportSets,
    onOver,
    onOut,
    getColor,
    keyEvents
  ) {
    $("#acd").addClass("newLoader");

    d3.select(".seqView")
      .selectAll("svg")
      .remove();

    var svg = d3
      .select(".seqView")
      .append("svg")
      .attr("class", "svg-element");

    var seqViewData = [];
    for (var i = 0; i < supportSets.length; i++) {
      if (parseInt(supportSets[i][0]) === this.props.posLeft) {
        seqViewData = supportSets[i][1];
      }
    }
    var x = 10;

    var ht = 0;
    var htMax = 0;
    var nWidth = 0;

    for (var i = 0; i < seqViewData.length - 1; i++) {
      ht = 0;
      var arr = seqViewData[i];
      var y = 0;
      for (var j = 0; j < arr.length - 1; j++) {
        var isKey = false;
        keyEvents.forEach(key => {
          if (key == arr[j]) isKey = true;
        });
        ht += 10;
        var color = getColor(eventMaps, parseInt(arr[j]));
        var rect = svg
          .append("rect")
          .attr("x", x)
          .attr("y", y)
          .attr("width", 10)
          .attr("height", 10)
          .style("fill", color)
          .attr("class", "rec")
          .on("mouseover", onOver)
          .on("mouseout", onOut);
        if (isKey) {
          rect.attr("class", "isKey");
        }
        y += 12;
      }
      if (htMax < ht) {
        htMax = ht;
        svg.attr("height", htMax);
      }
      x += 12;
      nWidth += 12;
      svg.attr("width", nWidth);
      svg.attr("width", nWidth + 20);
    }

    $("#acd").removeClass("newLoader");
  }
  onRectMouseOver() {
    d3.select(this).style("opacity", 0.7);
  }
  onRectMouseOut() {
    d3.select(this).style("opacity", 1);
  }
  getEventName(events, number) {
    var name;
    events.forEach(ele => {
      if (ele.number === number) {
        name = ele.name;
      }
    });
    return name;
  }

  getColor(eventMaps, eleNumber) {
    var color;
    eventMaps.forEach(ele => {
      if (ele.number === eleNumber) {
        color = ele.color;
      }
    });
    return color;
  }

  getSequence() {
    var datass = [];
    for (var i = 0; i < this.props.supportSets.length; i++) {
      if (this.props.supportSets[i][0] === this.props.posLeft) {
        datass = this.props.supportSets[i][1];
      }
    }
    return datass;
  }

  thisMouseOver(id) {
    $("[id^=abc]")
      .select()
      .css("opacity", 0.4);
    d3.select("#abc" + id).style("opacity", 1);
  }

  thisMouseOut() {
    $("[id^=abc]")
      .select()
      .css("opacity", 1);
  }

  render() {
    return (
      <React.Fragment>
        <div
          id={"abc" + this.props.posLeft}
          style={{ float: "left", position: "relative", marginLeft: 10 }}
        >
          <i
            className="fa fa-users usersIcon"
            aria-hidden="true"
            onMouseOver={() => this.thisMouseOver(this.props.posLeft)}
            onMouseOut={this.thisMouseOut}
            onClick={() =>
              this.appendSequenceView(
                this.props.eventMaps,
                this.props.supportSets,
                this.onRectMouseOver,
                this.onRectMouseOut,
                this.getColor,
                this.props.maps
              )
            }
          />
          <div id={this.getId()} className="styleFunnel" />
          {this.props.maps.map((a, i) => (
            <div>
              <div
                id="events"
                style={{
                  bottom:
                    300 +
                    (Number.parseFloat(this.props.percentages[i]).toPrecision(
                      2
                    ) /
                      100) *
                      650,
                  backgroundColor: this.getColor(
                    this.props.eventMaps,
                    parseInt(a)
                  )
                }}
              >
                <p className="percentage">
                  {Number.parseFloat(this.props.percentages[i]).toPrecision(3)}
                </p>
                <p
                  style={{
                    color: "black",
                    fontSize: 10,
                    position: "relative",
                    bottom: 65
                  }}
                >
                  {this.getEventName(this.props.eventMaps, parseInt(a))}
                </p>
              </div>
            </div>
          ))}
        </div>
      </React.Fragment>
    );
  }
}

export default PatternView;
