import React from 'react';
import PropTypes from 'prop-types';

import {InputNumber} from 'antd';


const numberStyle = {margin: '0px 20px 0px 20px'};


class SizeInput extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      height: props.rows,
      width: props.cols,
    };

    this.callback = props.onChange;
    this.handleWidthChange = this.handleWidthChange.bind(this);
    this.handleHeightChange = this.handleHeightChange.bind(this);
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      height: newProps.rows,
      width: newProps.cols,
    });
  }

  shouldComponentUpdate(newProps, newState) {
    return (
      newState.height !== this.state.height ||
      newState.width !== this.state.width
    );
  }

  handleWidthChange(v) {
    const data = {
      height: this.state.height,
      width: v,
    };
    this.setState(data);
    this.callback(data);
  }

  handleHeightChange(v) {
    const data = {
      height: v,
      width: this.state.width,
    };
    this.setState(data);
    this.callback(data);
  }

  render() {
    return (
      <div>
        Configure field size
        <div style={{margin: '16px'}}>
          row
          <InputNumber
            min={1}
            onChange={this.handleHeightChange}
            style={numberStyle}
            value={this.state.height}
          />
          col
          <InputNumber
            min={1}
            onChange={this.handleWidthChange}
            style={numberStyle}
            value={this.state.width}
          />
        </div>
      </div>
    );
  }

}

SizeInput.propTypes = {
  cols: PropTypes.number,
  rows: PropTypes.number,
  onChange: PropTypes.func,
};

SizeInput.defaultProps = {
  cols: 1,
  rows: 1,
  onChange: (args) => {
    console.log(args);
  },
};

export default SizeInput;
