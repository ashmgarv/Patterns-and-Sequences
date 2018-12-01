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
    keyEvents,
    bottomShift
  ) {
    $("#acd").addClass("newLoader");
    var barThreshold = 0;
    if (bottomShift === 300) {
      barThreshold = 10;
    } else barThreshold = 5;
    d3.select(".seqView")
      .selectAll("svg")
      .remove();

    d3.select(".barG")
      .select("svg")
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
    var barSvg = d3
      .select(".barG")
      .append("svg")
      .attr("height", 80)
      .attr("width", nWidth);

    var yScale = d3
      .scaleLinear()
      .domain([0, 10000])
      .range([80, 0]);

    barSvg.append("g").attr("transform", "translate(0," + 80 + ")");

    barSvg
      .append("g")
      .attr("class", "yAxis")
      .call(d3.axisLeft(yScale));

    var tooldiv = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip");
    for (var i = 0; i < seqViewData.length - 1; i++) {
      ht = 0;
      var arr = seqViewData[i];
      var y = 0;

      if (arr.length < barThreshold) {
        var rectB = barSvg
          .append("rect")
          .attr("x", x)
          .attr("y", yScale(6000))
          .attr("width", 10)
          .attr("height", 80 - yScale(6000))
          .style("fill", "gray")
          .attr("class", "rec")
          .on("mouseover", onOver)
          .on("mouseout", onOut);
      } else {
        var rectB = barSvg
          .append("rect")
          .attr("x", x)
          .attr("y", yScale(3000))
          .attr("width", 10)
          .attr("height", 80 - yScale(3000))
          .style("fill", "gray")
          .attr("class", "rec")
          .on("mouseover", onOver)
          .on("mouseout", onOut);
      }
      // }

      for (var j = 0; j < arr.length - 1; j++) {
        var isKey = false;
        keyEvents.forEach(key => {
          if (key == arr[j]) isKey = true;
        });
        ht += 10;
        var color = getColor(eventMaps, parseInt(arr[j]));
        var ele_name = this.getEventName(eventMaps, parseInt(arr[j]));
        var rect = svg
          .append("rect")
          .attr("x", x)
          .attr("y", y)
          .attr("width", 10)
          .attr("height", 10)
          .style("fill", color)
          .attr("class", "rec")
          .attr("name", ele_name)
          .on("mouseover", function() {
            d3.select(this)
              .transition()
              .duration(300)
              .style("opacity", 0.8);
            tooldiv
              .transition()
              .duration(300)
              .style("opacity", 1);
            tooldiv
              .text(this.getAttribute("name"))
              .style("left", d3.event.pageX + "px")
              .style("top", d3.event.pageY - 30 + "px");
          })
          .on("mouseout", function() {
            tooldiv.style("opacity", 0);
          });
        if (isKey) {
          rect.attr("class", "isKey");
        }
        y += 12;
      }
      if (htMax < ht) {
        htMax = ht;
        svg.attr("height", htMax + 50);
      }
      x += 12;
      nWidth += 12;
      svg.attr("width", nWidth);
      svg.attr("width", nWidth + 20);
      barSvg.attr("width", nWidth + 20);
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
                this.props.maps,
                this.props.bottomShift
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
                    this.props.bottomShift +
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
