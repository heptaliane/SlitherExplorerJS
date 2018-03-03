import React from 'react';
import PropTypes from 'prop-types';

import fore from './data/fore.json';


const size = [
  '40%',
  '20%',
  '40%',
];
const widthBias = {
  row: 2,
  col: 1,
  vertex: 1,
};
const heightBias = {
  row: 1,
  col: 2,
  vertex: 1,
};
const notFound = -1;

const isFound = function(list, ridx, cidx) {
  return list.indexOf(ridx * size.length + cidx) !== notFound;
};


class GridView extends React.Component {

  constructor(props) {
    super(props);

    this.type = props.type;
    this.state = {
      color: props.color,
      fore: props.idx,
      width: props.size * widthBias[props.type],
      height: props.size * heightBias[props.type],
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      color: newProps.color,
      fore: newProps.idx,
      width: newProps.size * widthBias[newProps.type],
      height: newProps.size * heightBias[newProps.type],
    });
  }

  shouldComponentUpdate(newProps, newState) {
    return (
      this.state.color !== newState.color ||
      this.state.fore !== newState.fore ||
      this.state.width !== newState.width ||
      this.state.height !== newState.height
    );
  }

  render() {
    return (
      <div
        style={{
          width: this.state.width,
          height: this.state.height,
        }}
      >
        {size.map((rsize, ridx) => {
          return (
            <div
              key={`r-${ridx}`}
              style={{
                height: rsize,
                width: '100%',
                overflow: 'hidden',
              }}
            >
              {size.map((csize, cidx) => {
                return (
                  <canvas
                    key={`c-${cidx}`}
                    style={{
                      backgroundColor: this.state.color,
                      height: '100%',
                      width: csize,
                      float: 'left',
                      opacity:
                        isFound(fore[this.type][this.state.fore], ridx, cidx) ?
                          1 :
                          0,
                    }}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }

}

GridView.propTypes = {
  color: PropTypes.string,
  idx: PropTypes.number,
  size: PropTypes.number,
  type: PropTypes.oneOf([
    'row',
    'col',
    'vertex',
  ]),
};

GridView.defaultProps = {
  color: '#000',
  idx: 0,
  size: 16,
  type: 'vertex',
};

export default GridView;
