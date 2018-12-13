import React from 'react';
import PropTypes from 'prop-types';

import {Radio, Icon, Button, Popconfirm} from 'antd';

import InputSlider from './InputSlider.jsx';

const containerStyle = {
  margin: '10px',
  padding: '10px',
  border: '2px solid lightgray',
  borderRadius: '5px',
  backgroundColor: 'white',
  textAlign: 'center',
};

const itemStyle = {
  margin: '10px',
  padding: '10px',
};

const btnStyle = {
  marginTop: '10px',
};

const availableIndex = [
  0,
  1,
  2,
  3,
  4,
];
const keyLeft = [
  'a',
  'h',
  '-',
  'ArrowLeft',
];
const keyRight = [
  'd',
  'l',
  '+',
  'ArrowRight',
];
const stateDelete = 4;
const not_found = -1;

class ControlArea extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      value: props.initialCellIdx,
    };

    this.cols = props.initialCols;
    this.rows = props.initialRows;

    this.callback = props.onChange;
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.handleRowChange = this.handleRowChange.bind(this);
    this.handleColumnChange = this.handleColumnChange.bind(this);
    this.handleModifyClick = this.handleModifyClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSaveCanvas = this.handleSaveCanvas.bind(this);
    this.handleClean = this.handleClean.bind(this);

    window.document.addEventListener('keydown', this.handleKeyDown);
  }

  handleRadioChange({target}) {
    this.callback({
      radio: target.value,
    });
    this.setState({
      value: target.value,
    });
  }

  handleRowChange(value) {
    this.rows = value;
  }

  handleColumnChange(value) {
    this.cols = value;
  }

  handleModifyClick() {
    this.callback({
      rows: this.rows,
      cols: this.cols,
    });
  }

  handleSubmit() {
    this.callback({
      submit: true,
    });
  }

  handleSaveCanvas() {
    const canvas = document.getElementsByTagName('canvas')[0];
    const result = canvas.toDataURL('image/png').
      replace('image/png', 'image/octet-stream');
    window.location.href = result;
  }

  handleClean() {
    this.callback({
      clean: true,
    });
  }

  handleKeyDown({key}) {
    if (availableIndex.indexOf(Number(key)) !== not_found) {
      this.callback({radio: Number(key)});
      this.setState({value: Number(key)});

    } else if (keyRight.indexOf(key) !== not_found) {
      const newValue = (this.state.value + 1) % 5;
      this.callback({radio: newValue});
      this.setState({value: newValue});

    } else if (keyLeft.indexOf(key) !== not_found) {
      const newValue = (this.state.value + 4) % 5;
      this.callback({radio: newValue});
      this.setState({value: newValue});
    }
  }

  render() {
    return (
      <div>
        <div style={containerStyle}>
          <h3>
Cell input number
          </h3>
          <Radio.Group
            buttonStyle="solid"
            value={this.state.value}
            onChange={this.handleRadioChange}
          >
            {availableIndex.map((idx) => {
              return (
                <Radio.Button
                  value={idx}
                  key={`radio-${idx}`}
                >
                  {
                    idx === stateDelete ?
                      <Icon type="delete" /> :
                      idx
                  }
                </Radio.Button>
              );
            })}
          </Radio.Group>
        </div>
        <div style={containerStyle}>
          <h3>
Field size
          </h3>
          <div style={itemStyle}>
            <InputSlider
              max={30}
              min={2}
              tics={1}
              initialValue={this.rows}
              label="rows"
              onChange={this.handleRowChange}
            />
          </div>
          <div style={itemStyle}>
            <InputSlider
              max={30}
              min={2}
              tics={1}
              initialValue={this.cols}
              label="cols"
              onChange={this.handleColumnChange}
            />
          </div>
          <Button
            type="primary"
            icon="reload"
            onClick={this.handleModifyClick}
          >
            Modify
          </Button>
        </div>
        <div style={containerStyle}>
          <Button
            style={btnStyle}
            block={true}
            type="primary"
            icon="check-circle"
            onClick={this.handleSubmit}
          >
            Solve
          </Button>
          <Button
            style={btnStyle}
            block={true}
            icon="download"
            onClick={this.handleSaveCanvas}
          >
            Save result as a image
          </Button>
          <Popconfirm
            title="Are you sure to clear all cell?"
            placement="top"
            onConfirm={this.handleClean}
          >
            <Button
              style={btnStyle}
              type="danger"
              block={true}
              icon="delete"
            >
              Clear all
            </Button>
          </Popconfirm>
        </div>
      </div>
    );
  }

}

ControlArea.propTypes = {
  initialCellIdx: PropTypes.oneOf(availableIndex),
  initialCols: PropTypes.number,
  initialRows: PropTypes.number,
  onChange: PropTypes.func,
};

ControlArea.defaultProps = {
  initialCellIdx: 4,
  initialCols: 7,
  initialRows: 7,
  onChange: (args) => {
    return console.log(args);
  },
};

export default ControlArea;
