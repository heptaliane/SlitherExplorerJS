import React from 'react';
import PropTypes from 'prop-types';

import Matrix from './matrix.js';
import GridCanvas from './GridCanvas.jsx';
import ControlArea from './ControlArea.jsx';


const defaultCellValue = 4;
const defaultGridValue = 2;
const defaultRows = 5;
const defaultCols = 5;
const defaultControlValue = 0;


const containerStyle = {
  padding: '10px',
  display: 'grid',
  gridGap: '20px',
  gridTemplateColumns: '1fr 3fr',
  textAlign: 'center',
};

const itemStyle = {
  padding: '10px',
  border: 'thick double lightgray',
  borderRadius: '10px',
};


class MainView extends React.Component {

  constructor(props) {
    super(props);

    this.controlValue = defaultControlValue;
    this.state = {
      cell: new Matrix({
        height: defaultRows,
        width: defaultCols,
        init: defaultCellValue,
      }),
      row: new Matrix({
        height: defaultRows + 1,
        width: defaultCols,
        init: defaultGridValue,
      }),
      col: new Matrix({
        height: defaultRows,
        width: defaultCols + 1,
        init: defaultGridValue,
      }),
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleCellClick = this.handleCellClick.bind(this);
  }

  handleChange({radio, cols, rows}) {
    if (radio !== undefined) {
      this.controlValue = radio;
    }
    if (cols !== undefined && rows !== undefined) {
      this.setState({
        cell: new Matrix({
          height: rows,
          width: cols,
          init: defaultCellValue,
        }),
        row: new Matrix({
          height: rows + 1,
          width: cols,
          init: defaultGridValue,
        }),
        col: new Matrix({
          height: rows,
          width: cols + 1,
          init: defaultGridValue,
        }),
      });
    }
  }

  handleCellClick({row, col}) {
    const newCell = new Matrix(this.state.cell);
    if (this.state.cell.get(row, col) === this.controlValue) {
      newCell.set(row, col, defaultCellValue);
    } else{
      newCell.set(row, col, this.controlValue);
    }

    this.setState({cell: newCell});
  }

  render() {
    return (
      <div style={containerStyle}>
        <div style={itemStyle}>
          <ControlArea
            initialCellIdx={this.controlValue}
            initialCols={defaultCols}
            initialRows={defaultRows}
            onChange={this.handleChange}
          />
        </div>
        <div style={itemStyle}>
          <GridCanvas
            cell={this.state.cell}
            row={this.state.row}
            col={this.state.col}
            onClick={this.handleCellClick}
          />
        </div>
      </div>
    );
  }

}

export default MainView;
