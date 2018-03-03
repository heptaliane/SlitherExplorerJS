import edgeDirection from './data/edgeDirection.json';
import diagonalCellCoord from './data/diagonalCellCoord.json';
import vertexMap from './data/vertexMap.json';

const bottomCoordIndexZero = -1;
const gridExcept = 0;
const cellExcept = 4;
const coordLength = 2;
const notFound = -1;
const stateForbidden = 0;
const stateDrawn = 1;
const stateUndef = 2;
const gridWaiting = 1;
const directionLength = 4;
const oppositDirection = 2;
const maxGridWithVertex = 2;
const minEdge = 2;
const cellZero = 0;

export default class SlitherUtils {

  static getVertexGrid(rgrid, cgrid, coord) {
    return [
      rgrid.get(coord[0], coord[1] - 1, gridExcept),
      cgrid.get(coord[0] - 1, coord[1], gridExcept),
      rgrid.get(coord[0], coord[1], gridExcept),
      cgrid.get(coord[0], coord[1], gridExcept),
    ];
  }

  static setVertexGrid(rgrid, cgrid, coord, grid) {
    rgrid.set(coord[0], coord[1] - 1, grid[0]);
    cgrid.set(coord[0] - 1, coord[1], grid[1]);
    rgrid.set(coord[0], coord[1], grid[2]);
    cgrid.set(coord[0], coord[1], grid[3]);
  }

  static getCellGrid(rgrid, cgrid, coord) {
    return [
      rgrid.get(coord[0], coord[1], gridExcept),
      cgrid.get(coord[0], coord[1], gridExcept),
      rgrid.get(coord[0] + 1, coord[1], gridExcept),
      cgrid.get(coord[0], coord[1] + 1, gridExcept),
    ];
  }

  static setCellGrid(rgrid, cgrid, coord, grid) {
    rgrid.set(coord[0], coord[1], grid[0]);
    cgrid.set(coord[0], coord[1], grid[1]);
    rgrid.set(coord[0] + 1, coord[1], grid[2]);
    cgrid.set(coord[0], coord[1] + 1, grid[3]);
  }

  static getDiagonalGrid(rgrid, cgrid, coord) {
    return [
      rgrid.get(coord[0], coord[1] - 1, gridExcept),
      cgrid.get(coord[0] - 1, coord[1], gridExcept),
      rgrid.get(coord[0], coord[1] + 1, gridExcept),
      cgrid.get(coord[0] - 1, coord[1] + 1, gridExcept),
      rgrid.get(coord[0] + 1, coord[1] - 1, gridExcept),
      cgrid.get(coord[0] + 1, coord[1], gridExcept),
      rgrid.get(coord[0] + 1, coord[1] + 1, gridExcept),
      cgrid.get(coord[0] + 1, coord[1] + 1, gridExcept),
    ];
  }

  static setDiagonalGrid(rgrid, cgrid, coord, grid) {
    rgrid.set(coord[0], coord[1] - 1, grid[0]);
    cgrid.set(coord[0] - 1, coord[1], grid[1]);
    rgrid.set(coord[0], coord[1] + 1, grid[2]);
    cgrid.set(coord[0] - 1, coord[1] + 1, grid[3]);
    rgrid.set(coord[0] + 1, coord[1] - 1, grid[4]);
    cgrid.set(coord[0] + 1, coord[1], grid[5]);
    rgrid.set(coord[0] + 1, coord[1] + 1, grid[6]);
    cgrid.set(coord[0] + 1, coord[1] + 1, grid[7]);
  }

  static getDiagonalCell(cell, coord) {
    return diagonalCellCoord.map((pos) => {
      return cell.get(coord[0] + pos[0], coord[1] + pos[1], cellExcept);
    });
  }

  static getCrossCell(cell, coord) {
    return [
      cell.get(coord[0] - 1, coord[1], cellExcept),
      cell.get(coord[0], coord[1] - 1, cellExcept),
      cell.get(coord[0] + 1, coord[1], cellExcept),
      cell.get(coord[0], coord[1] + 1, cellExcept),
    ];
  }

  static checkGridStatus(grid) {
    const cnt = [
      0,
      0,
    ];

    grid.forEach((state) => {
      if (state === stateForbidden) {
        cnt[0] += 1;
      } else if (state === stateDrawn) {
        cnt[1] += 1;
      }
    });

    return cnt;
  }

  static setGridValue(grid, num) {
    return grid.map((state) => {
      return state === stateUndef ?
        num :
        state;
    });
  }

  static countCircleEdge(rgrid, cgrid, coord) {
    const newCoord = [
      coord[0],
      coord[1],
    ];
    let direction = notFound;
    let ecnt = 0;

    // Count vertex with edge
    for (;;) {
      const grid = this.getVertexGrid(rgrid, cgrid, newCoord);
      direction = this.getDirection(grid, direction);

      // Edge found
      if (direction === notFound) {
        return notFound;
      }

      newCoord[0] += edgeDirection[direction][0];
      newCoord[1] += edgeDirection[direction][1];
      direction = (direction + oppositDirection) % directionLength;

      ecnt += 1;
      if (coord[0] === newCoord[0] && coord[1] === newCoord[1]) {
        return ecnt;
      }
    }
  }

  static isSatisfiedAboutCell(cell, rgrid, cgrid) {
    const coord = Array(coordLength);
    const row = cell.getHeight();
    const col = cell.getWidth();

    for (coord[0] = 0; coord[0] < row; coord[0] += 1) {
      for (coord[1] = 0; coord[1] < col; coord[1] += 1) {
        if (cell.get(coord[0], coord[1], cellExcept) !== cellExcept) {
          const grid = this.getCellGrid(rgrid, cgrid, coord);
          const cnt = this.checkGridStatus(grid);

          if (cnt[1] !== cell.get(coord[0], coord[1], cellExcept)) {
            return false;
          }
        }
      }
    }

    return true;
  }

  static isSatisfiedAboutEdge(rgrid, cgrid) {
    const coord = Array(coordLength);
    const row = rgrid.getHeight();
    const col = cgrid.getWidth();
    let edge = 0;

    for (coord[0] = 0; coord[0] < row; coord[0] += 1) {
      for (coord[1] = 0; coord[1] < col; coord[1] += 1) {
        const grid = SlitherUtils.getVertexGrid(rgrid, cgrid, coord);
        const cnt = SlitherUtils.checkGridStatus(grid);

        if (cnt[1] === gridWaiting) {
          edge += 1;
        }
      }
    }

    return edge <= minEdge;
  }

  static isSatisfiedAboutCircle(rgrid, cgrid) {
    const row = rgrid.getHeight();
    const col = cgrid.getWidth();
    const coord1 = Array(coordLength);
    let coord2 = Array(coordLength);
    let vcnt = 0;

    // Count all vertex which has grid
    for (coord1[0] = 0; coord1[0] < row; coord1[0] += 1) {
      for (coord1[1] = 0; coord1[1] < col; coord1[1] += 1) {
        const grid = this.getVertexGrid(rgrid, cgrid, coord1);
        const cnt = this.checkGridStatus(grid);

        if (cnt[1] === maxGridWithVertex) {
          vcnt += 1;
          coord2 = [
            coord1[0],
            coord1[1],
          ];
        }
      }
    }

    return vcnt === this.countCircleEdge(rgrid, cgrid, coord2);
  }

  static beforeSearchCellZero(coord, num, col) {
    // Coord is not out of range
    if (coord[0] !== bottomCoordIndexZero) {
      return coord;
    }

    // Num is not 0
    if (num !== cellZero) {
      return [
        0,
        bottomCoordIndexZero,
      ];
    }

    // (-1, -2) -> (-1, -1)
    if (coord[1] === bottomCoordIndexZero) {
      return [
        bottomCoordIndexZero,
        bottomCoordIndexZero,
      ];
    }

    // (-1, -1) -> (-1, col)
    if (coord[1] === 0) {
      return [
        bottomCoordIndexZero,
        col,
      ];
    }

    return [
      0,
      0,
    ];
  }

  static afterSearchCellZero(coord, num, row, col) {
    // If cell is not 0
    if (num !== cellZero) {
      return null;
    }

    // (row - 1, col - 1) -> (row, -1)
    if (coord[0] < row) {
      return [
        row,
        bottomCoordIndexZero,
      ];
    }

    // (row, -1) -> (row, col)
    if (coord[1] === bottomCoordIndexZero) {
      return [
        row,
        col,
      ];
    }

    return null;
  }

  // Initial coord must be (-1, -2)
  static searchCell(cell, num, coord) {
    const row = cell.getHeight();
    const col = cell.getWidth();
    let newCoord = [
      coord[0],
      coord[1],
    ];

    newCoord[1] += 1;
    newCoord = this.beforeSearchCellZero(newCoord, num, col);

    if (newCoord[0] === bottomCoordIndexZero) {
      newCoord[0] = 0;
    }

    // Search loop
    for (; newCoord[0] < row; newCoord[0] += 1) {
      for (; newCoord[1] < col; newCoord[1] += 1) {
        if (cell.get(newCoord[0], newCoord[1], cellExcept) === num) {
          return newCoord;
        }
      }
      newCoord[1] = 0;
    }

    return this.afterSearchCellZero(cell, num, row, col);
  }

  static getDirection(grid, prev) {
    let direction = notFound;
    grid.forEach((state, idx) => {
      if (state === stateDrawn && idx !== prev) {
        direction = idx;
      }
    });

    return direction;
  }

  static searchEdge(rgrid, cgrid, coord) {
    const row = rgrid.getHeight();
    const col = cgrid.getWidth();

    const newCoord = [
      coord[0],
      coord[1] + 1,
    ];

    for (; newCoord[0] < row; newCoord[0] += 1) {
      for (; newCoord[1] < col; newCoord[1] += 1) {
        const grid = this.getVertexGrid(rgrid, cgrid, newCoord);
        const cnt = this.checkGridStatus(grid);

        if (cnt[1] === gridWaiting) {
          return newCoord;
        }
      }
      newCoord[1] = 0;
    }

    return null;
  }

  static connectEdgePair(rgrid, cgrid, coord) {
    let direction = notFound;
    const newCoord = [
      coord[0],
      coord[1],
    ];

    for (;;) {
      const grid = this.getVertexGrid(rgrid, cgrid, newCoord);
      const cnt = this.checkGridStatus(grid);
      direction = this.getDirection(grid, direction);

      // Illegal edge is found
      if (cnt[1] > maxGridWithVertex) {
        return null;
      }

      // Another edge is found
      if (direction === notFound) {
        return newCoord;
      }

      newCoord[0] += edgeDirection[direction][0];
      newCoord[1] += edgeDirection[direction][1];

      direction = (direction + oppositDirection) % directionLength;

      if (newCoord[0] === coord[0] && newCoord[1] === coord[1]) {
        break;
      }
    }

    return null;
  }

  static getVertex(rgrid, cgrid, coord) {
    const grid = this.getVertexGrid(rgrid, cgrid, coord);

    for (let i = 0; i < vertexMap.length; i += 1) {
      if (grid[vertexMap[i][0]] === 1 &&
        grid[vertexMap[i][1]] === 1) {
        return i + 1;
      }
    }
  }

}

