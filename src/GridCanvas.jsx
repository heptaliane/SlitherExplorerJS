import React from 'react';
import PropTypes from 'prop-types';

import fore from './data/fore.json';
import Matrix from './matrix.js';
import SlitherUtils from './utils.js';


const defaultCellValue = 4;
const defaultGridValue = 2;
const LEFT_BUTTON_CLICKED = 0;
const GridDrawRatio = [
  0,
  0.4,
  0.6,
  1.0,
];
const wrapperStyle = {
  border: 'solid 2px lightgray',
  borderRadius: '10px',
  display: 'inline-block',
  margin: 'auto',
  padding: '20px',
};

const getRectCoord = function(idx, size) {
  const xidx = idx % 3;
  const yidx = Math.floor(idx / 3);

  return [
    size[0] * GridDrawRatio[xidx],
    size[1] * GridDrawRatio[yidx],
    size[0] * (GridDrawRatio[xidx + 1] - GridDrawRatio[xidx]),
    size[1] * (GridDrawRatio[yidx + 1] - GridDrawRatio[yidx]),
  ];
};

const drawRow = function(ctx, value, xidx, yidx, cellSize, vertexSize) {
  const xoffset = (cellSize + vertexSize) * xidx + vertexSize;
  const yoffset = (cellSize + vertexSize) * yidx;

  fore.row[value].forEach((idx) => {
    const [
      x,
      y,
      w,
      h,
    ] = getRectCoord(idx, [
      cellSize,
      vertexSize,
    ]);
    ctx.fillRect(xoffset + x, yoffset + y, w, h);
  });
};

const drawCol = function(ctx, value, xidx, yidx, cellSize, vertexSize) {
  const xoffset = (cellSize + vertexSize) * xidx;
  const yoffset = (cellSize + vertexSize) * yidx + vertexSize;

  fore.col[value].forEach((idx) => {
    const [
      x,
      y,
      w,
      h,
    ] = getRectCoord(idx, [
      vertexSize,
      cellSize,
    ]);
    ctx.fillRect(xoffset + x, yoffset + y, w, h);
  });
};

const drawVertex = function(ctx, value, xidx, yidx, cellSize, vertexSize) {
  const xoffset = (cellSize + vertexSize) * xidx;
  const yoffset = (cellSize + vertexSize) * yidx;

  fore.vertex[value].forEach((idx) => {
    const [
      x,
      y,
      w,
      h,
    ] = getRectCoord(idx, [
      vertexSize,
      vertexSize,
    ]);
    ctx.fillRect(xoffset + x, yoffset + y, w, h);
  });
};

const drawCell = function(ctx, value, xidx, yidx, cellSize, vertexSize) {
  const xoffset = (cellSize + vertexSize) * xidx + vertexSize;
  const yoffset = (cellSize + vertexSize) * yidx + vertexSize;

  if (value >= 0 && value < 4) {
    ctx.fillText(value, xoffset + 0.3 * cellSize, yoffset);
  }
};


class GridCanvas extends React.Component {

  constructor(props) {
    super(props);

    const cw = props.cell.getWidth();
    const ch = props.cell.getHeight();
    this.state = {
      width: cw * (props.cellSize + props.vertexSize) + props.vertexSize,
      height: ch * (props.cellSize + props.vertexSize) + props.vertexSize,
    };

    this.cell = props.cell;
    this.row = props.row;
    this.col = props.col;
    this.cellSize = props.cellSize;
    this.vertexSize = props.vertexSize;
    this.fore = props.fore;
    this.back = props.back;

    this.callback = props.onClick;
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.referenceCanvas = this.referenceCanvas.bind(this);
  }

  componentWillReceiveProps(newProps) {
    this.cell = newProps.cell;
    this.row = newProps.row;
    this.col = newProps.col;
    this.cellSize = newProps.cellSize;
    this.vertexSize = newProps.vertexSize;
    this.fore = newProps.fore;
    this.back = newProps.back;

    const cw = newProps.cell.getWidth();
    const ch = newProps.cell.getHeight();
    this.setState({
      width: cw * (this.cellSize + this.vertexSize) + this.vertexSize,
      height: ch * (this.cellSize + this.vertexSize) + this.vertexSize,
    });
    this.drawGridOnCanvas();
  }

  componentDidMount() {
    this.drawGridOnCanvas();
  }

  componentDidUpdate() {
    this.drawGridOnCanvas();
  }

  shouldComponentUpdate(newProps, newState) {
    return (
      this.state.width !== newState.width ||
      this.state.height !== newState.height
    );
  }

  referenceCanvas(ref) {
    this.canvas = ref;
  }

  handleMouseUp({buttons, clientX, clientY}) {
    const size = this.cellSize + this.vertexSize;
    const rect = this.canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const ridx = Math.floor(y / size);
    const cidx = Math.floor(x / size);

    if (buttons === LEFT_BUTTON_CLICKED &&
        x - cidx * size > this.vertexSize &&
        y - ridx * size > this.vertexSize) {
      this.callback({
        row: ridx,
        col: cidx,
      });
    }
  }

  drawGridOnCanvas() {
    this.canvas.width = this.state.width;
    this.canvas.height = this.state.height;

    const ctx = this.canvas.getContext('2d');
    ctx.fillStyle = this.back;
    ctx.fillRect(0, 0, this.state.width, this.state.height);

    ctx.fillStyle = this.fore;
    ctx.textBaseline = 'top';
    ctx.font = `${this.cellSize}px serif`;

    const rows = this.cell.getHeight();
    const cols = this.cell.getWidth();

    for (let xidx = 0; xidx < cols + 1; xidx += 1) {
      for (let yidx = 0; yidx < rows + 1; yidx += 1) {
        if (xidx !== cols && yidx !== rows) {
          drawCell(
            ctx, this.cell.get(yidx, xidx, defaultCellValue),
            xidx, yidx, this.cellSize, this.vertexSize
          );
        }
        if (yidx !== rows) {
          drawCol(
            ctx, this.col.get(yidx, xidx, defaultGridValue),
            xidx, yidx, this.cellSize, this.vertexSize
          );
        }
        if (xidx !== cols) {
          drawRow(
            ctx, this.row.get(yidx, xidx, defaultGridValue),
            xidx, yidx, this.cellSize, this.vertexSize
          );
        }

        const vertex = SlitherUtils.getVertex(
          this.row, this.col,
          [
            yidx,
            xidx,
          ]
        );
        drawVertex(
          ctx, vertex,
          xidx, yidx, this.cellSize, this.vertexSize
        );
      }
    }
  }

  render() {
    return (
      <div style={wrapperStyle}>
        <canvas
          style={{
            width: this.state.width,
            height: this.state.height,
            cursor: 'pointer',
          }}
          ref={this.referenceCanvas}
          onMouseUp={this.handleMouseUp}
        />
      </div>
    );
  }

}

GridCanvas.propTypes = {
  back: PropTypes.string,
  cell: PropTypes.instanceOf(Matrix),
  cellSize: PropTypes.number,
  col: PropTypes.instanceOf(Matrix),
  fore: PropTypes.string,
  row: PropTypes.instanceOf(Matrix),
  vertexSize: PropTypes.number,
  onClick: PropTypes.func,
};

GridCanvas.defaultProps = {
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
  row: new Matrix({
    width: 1,
    height: 1,
    init: 2,
  }),
  cellSize: 30,
  vertexSize: 15,
  fore: '#000',
  back: '#fff',
  onClick: (args) => {
    return console.log(args);
  },
};

export default GridCanvas;
