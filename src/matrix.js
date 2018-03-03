export default class Matrix {

  constructor(props) {
    if (props instanceof Matrix) {
      this._width = props.getWidth();
      this._height = props.getHeight();
      this._matrix = props.map((x) => {
        return x;
      });

    } else if (props instanceof Array && props[0] instanceof Array) {
      this._width = props.length;
      this._height = props[0].length;
      this._matrix = [];
      props.forEach((row) => {
        row.forEach((v) => {
          this._matrix.push(v);
        });
      });

    } else {
      this._width = props.width;
      this._height = props.height;

      const init = props.init === undefined ?
        0 :
        props.init;
      this._matrix = Array(this._height * this._width).fill(init);
    }
  }

  isValidIndex(ridx, cidx) {
    return (
      ridx >= 0 &&
      ridx < this._height &&
      cidx >= 0 &&
      cidx < this._width
    );
  }

  getIndex(ridx, cidx) {
    return ridx * this._width + cidx;
  }

  get(ridx, cidx, except) {
    return this.isValidIndex(ridx, cidx) ?
      this._matrix[this.getIndex(ridx, cidx)] :
      except;
  }

  set(ridx, cidx, value) {
    if (this.isValidIndex(ridx, cidx)) {
      this._matrix[this.getIndex(ridx, cidx)] = value;
    }
  }

  getWidth() {
    return this._width;
  }

  getHeight() {
    return this._height;
  }

  map(callback) {
    return this._matrix.map(callback);
  }

  forEach(callback) {
    this._matrix.forEach(callback);
  }

  toString() {
    return `[${this._matrix.join(', ')}]`;
  }

  equals(mat) {
    if (!(mat instanceof Matrix)) {
      return false;
    }
    if (mat.getWidth() !== this._width || mat.getHeight() !== this._height) {
      return false;
    }

    for (let i = 0; i < this._width; i += 1) {
      for (let j = 0; j < this._height; j += 1) {
        if (this.get(i, j, undefined) !== mat.get(i, j, undefined)) {
          return false;
        }
      }
    }

    return true;
  }

}
