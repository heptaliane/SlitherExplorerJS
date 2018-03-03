import React from 'react';
import PropTypes from 'prop-types';

import possibleValues from './data/possibleCellValues.json';


const enableBackColor = '#fff';
const disableBackColor = 'rgba(0,0,0,0)';
const undefState = 4;

class ToggleButton extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      disabled: props.disabled,
      size: props.size,
      value: props.value,
    };

    this.pos = props.pos;
    this.callback = props.onClick;
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      disabled: newProps.disabled,
      size: newProps.size,
      value: newProps.value,
    });
  }

  shouldComponentUpdate(newProps, newState) {
    return (
      this.state.disabled !== newState.disabled ||
      this.state.size !== newState.size ||
      this.state.value !== newState.value
    );
  }

  handleClick() {
    const newValue = (this.state.value + 1) % possibleValues.length;

    this.setState({value: newValue});
    this.callback(this.pos, newValue);
  }

  render() {
    return (
      <input
        disabled={this.state.disabled}
        onClick={this.handleClick}
        style={{
          border: this.state.disabled ?
            'none' :
            'thin dashed',
          backgroundColor: this.state.disabled ?
            disableBackColor :
            enableBackColor,
          height: this.state.size,
          width: this.state.size,
          textAlign: 'center',
        }}
        type="button"
        value={
          this.state.value === undefState ?
            '' :
            this.state.value
        }
      />
    );
  }

}

ToggleButton.propTypes = {
  disabled: PropTypes.bool,
  pos: PropTypes.arrayOf(PropTypes.number),
  size: PropTypes.number,
  value: PropTypes.oneOf(possibleValues),
  onClick: PropTypes.func,
};

ToggleButton.defaultProps = {
  disabled: false,
  pos: [
    0,
    0,
  ],
  size: 32,
  value: 4,
  onClick: (pos, value) => {
    console.log(`position: ${pos}, value: ${value}`);
  },
};

export default ToggleButton;
