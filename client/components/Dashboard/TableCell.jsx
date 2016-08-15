import { Component } from 'react';

class TableCell extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.children !== this.props.children;
  }

  render() {
    return <td className="truncate" style={{whiteSpace: "normal"}}>
        { this.props.children }
      </td>;
  }
}

export default TableCell;
