import React, { Component } from "react";
import "./";
import TopDiv from "./components/topdiv";
import ContextView from "./components/contextView";
import SequenceView from "./components/sequenceView";
import EventCategory from "./components/eventCategory";
import $ from "jquery";
import axios from "axios";
import AwesomeLoader from "./components/awesomeLoader";
import * as d3 from "d3";

class App extends Component {
  state = {
    selectmenus: [
      {
        menuName: "Funnel",
        items: ["Dataset1", "Dataset2"]
      },
      {
        menuName: "Select Dataset",
        items: ["Dataset1", "Dataset2"]
      },
      {
        menuName: "Vertical Scale",
        items: ["Dataset1", "Dataset2"]
      },
      {
        menuName: "Color Icicle By",
        items: ["Dataset1", "Dataset2"]
      },
      {
        menuName: "Order Icicle By",
        items: ["Dataset1", "Dataset2", "Dataset3"]
      }
    ],
    BarName: "Search Sequence",
    CheckBoxName: "Highlight Key Events",
    pats: [],
    EventMappings: [
      {
        number: 1,
        name: "frontpage",
        color: "#f49b41"
      },
      {
        number: 2,
        name: "news",
        color: "#f4cd41"
      },
      {
        number: 3,
        name: "tech",
        color: "#caf441"
      },
      {
        number: 4,
        name: "local",
        color: "#79f441"
      },
      {
        number: 5,
        name: "opinion",
        color: "#41f47f"
      },
      {
        number: 6,
        name: "on-air",
        color: "#41f4e2"
      },
      {
        number: 7,
        name: "misc",
        color: "#41d0f4"
      },
      {
        number: 8,
        name: "weather",
        color: "#418ef4"
      },
      {
        number: 9,
        name: "msn-news",
        color: "#414ff4"
      },
      {
        number: 10,
        name: "health",
        color: "#7f41f4"
      },
      {
        number: 11,
        name: "living",
        color: "#be41f4"
      },
      {
        number: 12,
        name: "business",
        color: "#f441cd"
      },
      {
        number: 13,
        name: "msn-sports",
        color: "#f44182"
      },
      {
        number: 14,
        name: "sports",
        color: "#db867a"
      },
      {
        number: 15,
        name: "summary",
        color: "#d17c57"
      },
      {
        number: 16,
        name: "bbs",
        color: "#c6db0f"
      },
      {
        number: 17,
        name: "travel",
        color: "#db6e0f"
      }
    ],
    SupportSets: [],
    previousStatePats: []
  };
  constructor() {
    super();
    this.startSearch = this.startSearch.bind(this);
  }
  componentDidMount() {
    var patterns = [];
    var percArray = [];
    axios.get("http://127.0.0.1:8000/api/").then(res => {
      patterns = res.data.pruned_patterns;
      Object.entries(res.data.event_support).map(i => {
        percArray.push(i[1]);
      });

      var sup_sets = [];
      Object.entries(JSON.parse(res.data.individual_support_sets)).map(
        entry => {
          sup_sets.push(entry);
        }
      );

      var id = 0;
      var finalPatterns = [];
      for (var i = 0; i < patterns.length; i++) {
        finalPatterns.push({
          key: patterns[i],
          id: id,
          percentages: percArray[i]
        });
        id += 1;
      }

      this.setState({
        pats: finalPatterns,
        SupportSets: sup_sets
      });
    });
  }
  startSearch(eventMap, patterns) {
    var x = $("#srchBtn");
    var y = $("#srchBtn").select();
    if (document.getElementById("srchBtn").name === "Search Sequence") {
      var eventPattern = [];
      var x = $("#srch").val();
      var events = x.split(",");
      var isLegitSequence = false;
      for (var d = 0; d < events.length; d++) {
        isLegitSequence = false;
        for (var k = 0; k < eventMap.length; k++) {
          if (eventMap[k].name === events[d]) {
            eventPattern.push(eventMap[k].number);
            isLegitSequence = true;
            break;
          }
        }
        if (isLegitSequence) continue;
        else break;
      }
      var found = false;
      var newPats = [];
      if (!isLegitSequence) {
        alert("Invalid Pattern Sequence");
      } else {
        for (var l = 0; l < patterns.length; l++) {
          for (var u = 0; u < eventPattern.length; u++) {
            if (patterns[l].key.includes(eventPattern[u].toString())) {
              found = true;
              newPats.push(patterns[l]);
              break;
            }
          }
        }
        if (found) {
          d3.select(".seqView")
            .select("svg")
            .remove();
          $("#srch").css("display", "none");
          $("#srch").val("");
          this.setState({
            previousStatePats: this.state.pats,
            pats: newPats,
            BarName: "Start Again"
          });
        } else {
          alert("Sorry, none of the events' frequent");
        }
      }
    } else {
      $("#srch").css("display", "inline");
      this.setState({
        pats: this.state.previousStatePats,
        BarName: "Search Sequence"
      });
    }
  }

  getName(eventMap, number) {
    for (var t = 0; t < eventMap.length; t++) {
      if (eventMap[t].number === number) return eventMap[t].name;
    }
  }

  getData() {
    var x = $("#root").data("new");
    return x;
  }
  render() {
    return (
      <React.Fragment>
        <TopDiv
          selectmenus={this.state.selectmenus}
          BarName={this.state.BarName}
          CheckBoxName={this.state.CheckBoxName}
          startSearch={this.startSearch}
          eventMap={this.state.EventMappings}
          pats={this.state.pats}
        />
        {this.state &&
        this.state.pats.length !== 0 &&
        this.state.SupportSets.length !== 0 ? (
          <ContextView
            data={this.state.pats}
            EventMappings={this.state.EventMappings}
            supportSets={this.state.SupportSets}
          />
        ) : (
          <div className="loader">
            <AwesomeLoader />
          </div>
        )}
        <SequenceView />
        <EventCategory EventMappings={this.state.EventMappings} />
      </React.Fragment>
    );
  }
}

export default App;
