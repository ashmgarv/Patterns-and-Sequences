import React, { Component } from "react";
class EventCategory extends Component {
  render() {
    return (
      <table className="eventCategoryTable">
        {this.props.EventMappings.map(event => (
          <tr>
            <td>{event.name}</td>
            <td>
              <div
                style={{ width: 10, height: 10, backgroundColor: event.color }}
              />
            </td>
          </tr>
        ))}
      </table>
    );
  }
}

export default EventCategory;
