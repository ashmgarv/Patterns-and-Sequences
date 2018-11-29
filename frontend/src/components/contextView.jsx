import React, { Component } from "react";
import PatternView from "./patternView";

class ContextView extends Component {
  state = {
    data: {
      datas: [["Inquiries", 5000, "#D3D3D3"]],
      options: {
        chart: {
          height: 650,
          width: 50,
          animate: 600,
          bottomWidth: 0.2,
          curve: {
            enabled: true
          }
        },
        block: {
          dynamicHeight: true,
          minHeight: 15
        },
        label: {
          enabled: false,
          highlight: true
        }
      }
    }
  };

  render() {
    return (
      <React.Fragment>
        <div className="contextView" />
        <div className="scroll">
          <div className="patternViewContainer">
            {this.props.data.map(map => (
              <PatternView
                supportSets={this.props.supportSets}
                data={this.state.data}
                maps={map.key}
                eventMaps={this.props.EventMappings}
                posLeft={map.id}
                percentages={map.percentages}
              />
            ))}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ContextView;
