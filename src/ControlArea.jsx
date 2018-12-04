import React from 'react';
import PropTypes from 'prop-types';

import {Radio, Icon, Button} from 'antd';

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

const availableIndex = [0, 1, 2, 3, 4];
const stateDelete = 4;

class ControlArea extends React.PureComponent {

  constructor(props) {
    super(props);

    this.initialCellIdx = props.initialCellIdx;
    this.cols = props.initialCols;
    this.rows = props.initialRows;

    this.callback = props.onChange;
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.handleRowChange = this.handleRowChange.bind(this);
    this.handleColumnChange = this.handleColumnChange.bind(this);
    this.handleModifyClick = this.handleModifyClick.bind(this);
  }

  handleRadioChange({target}) {
    this.callback({
      radio: target.value,
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

  render() {
    return (
      <div>
        <div style={containerStyle}>
          <Radio.Group
            buttonStyle="solid"
            defaultValue={this.initialCellIdx}
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
                    <Icon type="delete" />:
                    idx
                  }
                </Radio.Button>
              );
            })}
          </Radio.Group>
        </div>
        <div style={containerStyle}>
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
      </div>
    );
  }
};

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
  onChange: (args) => console.log(args),
};

export default ControlArea;
