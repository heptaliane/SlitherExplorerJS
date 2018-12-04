import React from 'react';
import PropTypes from 'prop-types';

import {Slider, InputNumber} from 'antd';

const containerStyle = {
  padding: '10px',
  display: 'grid',
  gridGap: '10px',
  gridTemplateColumns: '1fr 7fr 1fr',
  textAlign: 'center',
};

class InputSlider extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      value: props.initialValue,
    };

    this.label = props.label;
    this.tics = props.tics;
    this.max = props.max;
    this.min = props.min;
    this.callback = props.onChange;

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value) {
    if (isNaN(value)) {
      return;
    }

    this.setState({value: value});
    this.callback(value);
  }

  render() {
    return (
      <div style={containerStyle}>
        <div>
          {this.label}
        </div>
        <div>
          <Slider
            max={this.max}
            min={this.min}
            step={this.tics}
            value={this.state.value}
            onChange={this.handleChange}
          />
        </div>
        <div>
          <InputNumber
            max={this.max}
            min={this.min}
            step={this.tics}
            value={this.state.value}
            onChange={this.handleChange}
          />
        </div>
      </div>
    );
  }
};

InputSlider.propTypes = {
  initialValue: PropTypes.number,
  max: PropTypes.number,
  min: PropTypes.number,
  tics: PropTypes.number,
  label: PropTypes.string,
  onChange: PropTypes.func,
};

InputSlider.defaultProps = {
  initialValue: 0,
  max: 20,
  min: 0,
  tics: 1,
  label: '',
  onChange: (args) => console.log(args),
};

export default InputSlider;
