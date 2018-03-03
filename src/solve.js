import Matrix from './matrix.js';
import SlitherUtils from './utils.js';
import Definite from './definite.js';

const bottomCoordIndex = -1;
const notFound = -1;
const initDirection = 0;
const noDirection = 4;
const stateUndef = 2;
const stateDrawn = 1;
const initCoord = [
  0,
  bottomCoordIndex,
];


export default class Solve {

  constructor(cell, rgrid, cgrid) {
    this.store = [
      {
        rgrid: rgrid,
        cgrid: cgrid,
        coord: SlitherUtils.searchEdge(rgrid, cgrid, initCoord),
        direction: notFound,
      },
    ];
    this._cell = cell;
  }

  getNextDirection(rgrid, cgrid, coord, prev) {
    const grid = SlitherUtils.getVertexGrid(
      rgrid,
      cgrid,
      coord
    );
    let direction = prev;

    for (; direction < grid.length; direction += 1) {
      if (grid[direction] === stateUndef) {
        grid[direction] = stateDrawn;
        SlitherUtils.setVertexGrid(rgrid, cgrid, coord, grid);
        break;
      }
    }

    return direction;
  }

  back() {
    const data = this.store.pop();

    data.direction += 1;
    data.rgrid = new Matrix(this.store[this.store.length - 1].rgrid);
    data.cgrid = new Matrix(this.store[this.store.length - 1].cgrid);

    return data;
  }

  nextStep() {
    let data = {
      rgrid: new Matrix(this.store[this.store.length - 1].rgrid),
      cgrid: new Matrix(this.store[this.store.length - 1].cgrid),
      coord: SlitherUtils.searchEdge(
        this.store[this.store.length - 1].rgrid,
        this.store[this.store.length - 1].cgrid,
        initCoord
      ),
      direction: initDirection,
    };

    if (data.coord === null) {
      return true;
    }

    for (;;) {
      data.direction = this.getNextDirection(
        data.rgrid,
        data.cgrid,
        data.coord,
        data.direction
      );

      // All direction is failed in current coord
      if (data.direction === noDirection) {
        if (this.store.length > 1) {
          data = this.back();

        // All direction in every coord is failed
        } else {
          return false;
        }

      // Apply definite to test
      } else {
        const result = Definite.run(this._cell, data.rgrid, data.cgrid);

        // Test success
        if (result.error === undefined) {
          data.rgrid = result.rgrid;
          data.cgrid = result.cgrid;
          this.store.push(data);
          return true;

        // Test failed
        }
        data.direction += 1;
        data.rgrid = new Matrix(this.store[this.store.length - 1].rgrid);
        data.cgrid = new Matrix(this.store[this.store.length - 1].cgrid);

      }
    }
  }

  isCompleted() {
    const idx = this.store.length - 1;

    return SlitherUtils.isSatisfiedAboutCircle(
      this.store[idx].rgrid,
      this.store[idx].cgrid
    ) &&
      SlitherUtils.searchEdge(
        this.store[idx].rgrid,
        this.store[idx].cgrid,
        initCoord
      ) === null;
  }

}
