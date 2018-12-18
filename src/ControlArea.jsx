import React from 'react';
import PropTypes from 'prop-types';

import {Radio, Icon, Input, Button, Popconfirm} from 'antd';

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

const colorStyle = Object.assign(
  {},
  itemStyle,
  {
    display: 'grid',
    gridGap: '20px',
    gridTemplateColumns: '2fr 2fr 1fr',
  }
);

const btnStyle = {
  marginTop: '10px',
};

const paletteStyle = {
  border: 'dashed 2px lightgray',
  borderRadius: '100%',
};

const availableIndex = [
  0,
  1,
  2,
  3,
  4,
];
const keyLeft = [
  'h',
  '-',
  'ArrowLeft',
];
const keyRight = [
  'l',
  '+',
  'ArrowRight',
];
const stateDelete = 4;
const not_found = -1;
const maxLength = 6;

class ControlArea extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      value: props.initialCellIdx,
      fore: props.initialFore,
      back: props.initialBack,
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
    this.handleColor = this.handleColor.bind(this);

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

  handleColor({target}) {
    if (target.value.length <= maxLength && (/^[0-9a-f]*$/).test(target.value)) {
      this.setState({
        [target.name]: target.value,
      });
      this.callback({
        [target.name]: target.value,
      });
    }
  }

  handleSaveCanvas() {
    const canvas = document.getElementsByTagName('canvas')[0];
    const result = canvas.toDataURL('image/png').
      replace('image/png', 'image/octet-stream');
    window.location.href = result;
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
          <h3>
            Color
          </h3>
          <div style={colorStyle}>
            <div>
foreground color
            </div>
            <Input
              addonBefore="#"
              value={this.state.fore}
              name="fore"
              onChange={this.handleColor}
            />
            <div
              style={Object.assign({
                backgroundColor: `#${this.state.fore}`,
              }, paletteStyle)}
            />
          </div>
          <div style={colorStyle}>
            <div>
background color
            </div>
            <Input
              addonBefore="#"
              value={this.state.back}
              name="back"
              onChange={this.handleColor}
            />
            <div
              style={Object.assign({
                backgroundColor: `#${this.state.back}`,
              }, paletteStyle)}
            />
          </div>
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
            onConfirm={this.handleModifyClick}
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
  initialBack: PropTypes.string,
  initialCellIdx: PropTypes.oneOf(availableIndex),
  initialCols: PropTypes.number,
  initialFore: PropTypes.string,
  initialRows: PropTypes.number,
  onChange: PropTypes.func,
};

ControlArea.defaultProps = {
  initialCellIdx: 4,
  initialCols: 7,
  initialRows: 7,
  initialFore: '000',
  initialBack: 'fff',
  onChange: (args) => {
    return console.log(args);
  },
};

export default ControlArea;
