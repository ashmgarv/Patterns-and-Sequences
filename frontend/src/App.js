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
    pats2: [],
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
    EventMappings2: [
      {
        number: 1,
        name: "login",
        color: "#f49b41"
      },
      {
        number: 2,
        name: "record",
        color: "#f4cd41"
      },
      {
        number: 3,
        name: "technology",
        color: "#caf441"
      },
      {
        number: 4,
        name: "patterns",
        color: "#79f441"
      },
      {
        number: 5,
        name: "cart",
        color: "#41f47f"
      },
      {
        number: 6,
        name: "startpage",
        color: "#41f4e2"
      },
      {
        number: 7,
        name: "miscellaneous",
        color: "#41d0f4"
      },
      {
        number: 8,
        name: "weather",
        color: "#418ef4"
      },
      {
        number: 9,
        name: "products",
        color: "#414ff4"
      },
      {
        number: 10,
        name: "statehealth",
        color: "#7f41f4"
      },
      {
        number: 11,
        name: "livingstyle",
        color: "#be41f4"
      },
      {
        number: 12,
        name: "cards",
        color: "#f441cd"
      },
      {
        number: 13,
        name: "football",
        color: "#f44182"
      },
      {
        number: 14,
        name: "cricket",
        color: "#db867a"
      },
      {
        number: 15,
        name: "summary",
        color: "#d17c57"
      },
      {
        number: 16,
        name: "bbst",
        color: "#c6db0f"
      },
      {
        number: 17,
        name: "transactions",
        color: "#db6e0f"
      },
      {
        number: 18,
        name: "egg",
        color: "#b8c1d1"
      },
      {
        number: 19,
        name: "datum",
        color: "#cc309d"
      },
      {
        number: 20,
        name: "iphone",
        color: "#e896cf"
      },
      {
        number: 21,
        name: "mac",
        color: "#db6e0f"
      },
      {
        number: 22,
        name: "bin",
        color: "#5f89ce"
      },
      {
        number: 23,
        name: "total",
        color: "#772e61"
      },
      {
        number: 24,
        name: "cllege",
        color: "#3a3338"
      },
      {
        number: 25,
        name: "university",
        color: "#0f6811"
      },
      {
        number: 26,
        name: "food",
        color: "#db6e0f"
      },
      {
        number: 27,
        name: "counties",
        color: "#0ddd11"
      },
      {
        number: 28,
        name: "laptops",
        color: "#cae25d"
      },
      {
        number: 29,
        name: "names",
        color: "#e1e8c2"
      }
    ],
    prevState: [],
    SupportSets: [],
    firstDataset: [],
    secondDataset: [],
    SupportSets2: [],
    previousStatePats2: [],
    bottomShift1: 300,
    bottomShift2: 700,
    bottomShift: 300
  };

  constructor() {
    super();
    this.startSearch = this.startSearch.bind(this);
    this.onDataSetChanged = this.onDataSetChanged.bind(this);
  }
  componentDidMount() {
    var patterns2 = [];
    var percArray2 = [];
    var patterns = [];
    var percArray = [];
    axios.get("http://127.0.0.1:8000/api/").then(res => {
      patterns = res.data.pruned_patterns;
      patterns2 = res.data.pruned_patterns_2;
      Object.entries(res.data.event_support_2).map(i => {
        percArray2.push(i[1]);
      });
      Object.entries(res.data.event_support).map(i => {
        percArray.push(i[1]);
      });
      var sup_sets = [];
      Object.entries(JSON.parse(res.data.individual_support_sets)).map(
        entry => {
          sup_sets.push(entry);
        }
      );
      var sup_sets2 = [];
      Object.entries(res.data.individual_support_set_2).map(entry => {
        sup_sets2.push(entry);
      });

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

      var id2 = 0;
      var finalPatterns2 = [];
      for (var j = 0; j < patterns2.length; j++) {
        finalPatterns2.push({
          key: patterns2[j],
          id: id2,
          percentages: percArray2[j]
        });
        id2 += 1;
      }

      this.setState({
        pats2: finalPatterns2,
        SupportSets2: sup_sets2
      });

      this.setState({
        pats: finalPatterns,
        SupportSets: sup_sets
      });

      this.setState({
        firstDataset: {
          pats: this.state.pats,
          SupportSets: this.state.SupportSets,
          EventMappings: this.state.EventMappings
        }
      });
      this.setState({
        secondDataset: {
          pats: this.state.pats2,
          SupportSets: this.state.SupportSets2,
          EventMappings: this.state.EventMappings2
        }
      });
    });
  }
  startSearch(eventMap, patterns) {
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
      d3.select(".seqView")
        .select("svg")
        .remove();
      $("#srch").css("display", "inline");
      this.setState({
        pats: this.state.previousStatePats,
        BarName: "Search Sequence"
      });
    }
  }
  onDataSetChanged() {
    var e = document.getElementById("selMenu");
    var selDataset = e.options[e.selectedIndex].text;
    d3.select(".seqView")
      .select("svg")
      .remove();
    d3.select(".barG")
      .select("svg")
      .remove();
    if (selDataset === "Dataset1") {
      this.setState({
        pats: this.state.firstDataset.pats,
        SupportSets: this.state.firstDataset.SupportSets,
        EventMappings: this.state.firstDataset.EventMappings,
        bottomShift: this.state.bottomShift1
      });
    } else {
      this.setState({
        pats: this.state.secondDataset.pats,
        SupportSets: this.state.secondDataset.SupportSets,
        EventMappings: this.state.secondDataset.EventMappings,
        bottomShift: this.state.bottomShift2
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
          datasetChanged={this.onDataSetChanged}
        />
        {this.state &&
        this.state.pats.length !== 0 &&
        this.state.SupportSets.length !== 0 ? (
          <ContextView
            data={this.state.pats}
            EventMappings={this.state.EventMappings}
            supportSets={this.state.SupportSets}
            bottomShift={this.state.bottomShift}
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
