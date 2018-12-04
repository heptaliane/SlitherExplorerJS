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


class MainView extends React.Component {
  constructor(props) {
    super(props);

    this.controlValue = defaultControlValue;
    this.state ={
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
    this.handleCellChange = this.handleCellChange.bind(this);
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

  handleCellChange({row, col}) {
    this.cell.set(row, col, this.controlValue);
  }

  render() {
    return (
      <div style={containerStyle}>
        <ControlArea
          initialCellIdx={this.controlValue}
          initialCols={defaultCols}
          initialRows={defaultRows}
          onChange={this.handleChange}
        />
        <GridCanvas
          cell={this.state.cell}
          row={this.state.row}
          col={this.state.col}
          onChange={this.handleCellChange}
        />
      </div>
    );
  }
};

export default MainView;
