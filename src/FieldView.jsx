import React from 'react';
import PropTypes from 'prop-types';

import GridView from './GridView.jsx';
import ToggleButton from './ToggleButton.jsx';
import Matrix from './matrix.js';
import SlitherUtils from './utils.js';

const rowVar = 2;
const colVar = 2;
const cellDefault = 4;
const rowDefault = 2;
const colDefault = 2;

const containerStyle = {
  display: 'inline-block',
  margin: 'auto',
};

class FieldView extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      cell: props.cell,
      row: props.row,
      col: props.col,
      disabled: props.disabled,
    };
    this.rowarr = Array(props.cell.getHeight() * rowVar + 1).fill(0);
    this.colarr = Array(props.cell.getWidth() * colVar + 1).fill(0);
    this.callback = props.onChange;
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      cell: newProps.cell,
      row: newProps.row,
      col: newProps.col,
      disabled: newProps.disabled,
    });
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.cell.getHeight() !== this.state.cell.getHeight()) {
      this.rowarr = Array(nextState.cell.getHeight() * rowVar + 1).fill(0);
    }
    if (nextState.cell.getWidth() !== this.state.cell.getWidth()) {
      this.colarr = Array(nextState.cell.getWidth() * colVar + 1).fill(0);
    }
  }

  handleChange(pos, value) {
    this.callback(pos, value);
  }

  render() {
    return (
      <div style={containerStyle}>
        {this.rowarr.map((_, r) => {
          const ridx = Math.floor(r / rowVar);

          if (r % rowVar === 0) {
            return (
              <div
                key={`r-${r}`}
                style={{overflow: 'hidden'}}
              >
                {this.colarr.map((_, c) => {
                  const cidx = Math.floor(c / colVar);

                  // Vertex
                  if (c % colVar === 0) {
                    return (
                      <div
                        key={`${c}-${r}`}
                        style={{float: 'left'}}
                      >
                        <GridView
                          key={`v-${cidx}-${ridx}`}
                          idx={
                            SlitherUtils.getVertex(
                              this.state.row,
                              this.state.col,
                              [
                                ridx,
                                cidx,
                              ]
                            )
                          }
                          type="vertex"
                        />
                      </div>
                    );

                    // Row
                  }
                  return (
                    <div
                      key={`${c}-${r}`}
                      style={{float: 'left'}}
                    >
                      <GridView
                        key={`r-${cidx}-${ridx}`}
                        idx={this.state.row.get(ridx, cidx, rowDefault)}
                        type="row"
                      />
                    </div>
                  );

                })}
              </div>
            );
          }
          return (
            <div
              key={`r-${r}`}
              style={{overflow: 'hidden'}}
            >
              {this.colarr.map((_, c) => {
                const cidx = Math.floor(c / colVar);

                // Col
                if (c % colVar === 0) {
                  return (
                    <div
                      key={`${c}-${r}`}
                      style={{float: 'left'}}
                    >
                      <GridView
                        key={`c-${cidx}-${ridx}`}
                        idx={this.state.col.get(ridx, cidx, colDefault)}
                        type="col"
                      />
                    </div>
                  );

                  // Cell
                }
                return (
                  <div
                    key={`${c}-${r}`}
                    style={{float: 'left'}}
                  >
                    <ToggleButton
                      key={`${cidx}-${ridx}`}
                      disabled={this.state.disabled}
                      onClick={this.handleChange}
                      pos={[
                        ridx,
                        cidx,
                      ]}
                      value={this.state.cell.get(ridx, cidx, cellDefault)}
                    />
                  </div>
                );

              })}
            </div>
          );

        })}
      </div>
    );
  }

}

FieldView.propTypes = {
  cell: PropTypes.instanceOf(Matrix),
  col: PropTypes.instanceOf(Matrix),
  disabled: PropTypes.bool,
  row: PropTypes.instanceOf(Matrix),
  onChange: PropTypes.func,
};

FieldView.defaultProps = {
  cell: new Matrix({
    width: 1,
    height: 1,
    init: 4,
  }),
  col: new Matrix({
    width: 1,
    height: 1,
    init: 2,
  }),
  disabled: false,
  row: new Matrix({
    width: 1,
    height: 1,
    init: 2,
  }),
  onChange: (pos, value) => {
    console.log(`position: ${pos}, value: ${value}`);
  },
};

export default FieldView;
