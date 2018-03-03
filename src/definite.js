import Matrix from './matrix.js';
import SlitherUtils from './utils.js';
import diagonalOpposit from './data/diagonalOpposit.json';
import diagonalCellCoord from './data/diagonalCellCoord.json';
import diagonalBeside from './data/diagonalBeside.json';
import vertexPos from './data/vertexPos.json';

const gridExcept = 0;
const cellNumberLength = 4;
const diagonalGridPerCell = 2;
const gridForbiddenWaiting = 3;
const gridWaiting = 1;
const stateDrawn = 1;
const stateForbidden = 0;
const stateUndef = 2;
const maxGrid = 2;
const maxGridIndex = 3;
const bottomCoordIndexZero = -1;
const cellThree = 3;
const cellTwo = 2;
const cellOne = 1;
const cellZero = 0;
const coordLength = 2;
const initCellCoord = [
  bottomCoordIndexZero,
  bottomCoordIndexZero - 1,
];
const initEdgeCoord = [
  0,
  bottomCoordIndexZero,
];


export default class Definite {

  static setGridWithCell(cell, rgrid, cgrid) {
    for (let num = 0; num < cellNumberLength; num += 1) {
      let coord = initCellCoord.concat();

      for (;;) {
        coord = SlitherUtils.searchCell(cell, num, coord);

        // If no coordinate is found
        if (coord === null) {
          break;
        }

        let grid = SlitherUtils.getCellGrid(rgrid, cgrid, coord);
        const cnt = SlitherUtils.checkGridStatus(grid);

        // Less grid can be drawn than cell number
        if (cnt[0] > cellNumberLength - num) {
          return false;
        }

        // More grid is found than cell number
        if (cnt[1] > num) {
          return false;
        }

        // Available grid equals to cell number
        if (cnt[0] === cellNumberLength - num && cnt[1] !== num) {
          grid = SlitherUtils.setGridValue(grid, stateDrawn);

        // No available grid is left
        } else if (cnt[0] !== cellNumberLength - num && cnt[1] === num) {
          grid = SlitherUtils.setGridValue(grid, stateForbidden);
        }

        SlitherUtils.setCellGrid(rgrid, cgrid, coord, grid);
      }
    }

    return true;
  }

  static setGridWithVertex(rgrid, cgrid) {
    const coord = Array(coordLength);
    const row = rgrid.getHeight();
    const col = cgrid.getWidth();

    for (coord[0] = 0; coord[0] < row; coord[0] += 1) {
      for (coord[1] = 0; coord[1] < col; coord[1] += 1) {
        let grid = SlitherUtils.getVertexGrid(rgrid, cgrid, coord);
        const cnt = SlitherUtils.checkGridStatus(grid);

        // Invalid grid
        if (cnt[0] === gridForbiddenWaiting && cnt[1] === gridWaiting) {
          return false;
        }

        // Invalid grid
        if (cnt[1] > maxGrid) {
          return false;
        }

        // All grid or last grid is forbidden
        if (cnt[0] === gridForbiddenWaiting && cnt[1] === 0 ||
          cnt[0] !== maxGrid && cnt[1] === maxGrid) {
          grid = SlitherUtils.setGridValue(grid, stateForbidden);
          SlitherUtils.setVertexGrid(rgrid, cgrid, coord, grid);
        }

        // Last grid is drawn
        if (cnt[0] === maxGrid && cnt[1] === gridWaiting) {
          grid = SlitherUtils.setGridValue(grid, stateDrawn);
          SlitherUtils.setVertexGrid(rgrid, cgrid, coord, grid);
        }

      }
    }

    return true;
  }

  static setGridWithEdgePair(cell, rgrid, cgrid) {
    let coord1 = initEdgeCoord.concat();

    // If circle is nearly completed
    const cellflg = SlitherUtils.isSatisfiedAboutCell(cell, rgrid, cgrid);
    const edgeflg = SlitherUtils.isSatisfiedAboutEdge(rgrid, cgrid);

    for (;;) {
      coord1 = SlitherUtils.searchEdge(rgrid, cgrid, coord1);
      // No edge left
      if (coord1 === null) {
        return true;
      }

      const coord2 = SlitherUtils.connectEdgePair(rgrid, cgrid, coord1);

      // Invalid edge
      if (coord2 === null) {
        return false;
      }

      if (coord1[0] + 1 === coord2[0] && coord1[1] === coord2[1]) {
        if (!edgeflg &&
          cgrid.get(coord1[0], coord1[1], gridExcept) !== stateDrawn) {
          cgrid.set(coord1[0], coord1[1], stateForbidden);
        } else if (cellflg && edgeflg) {
          cgrid.set(coord1[0], coord1[1], stateDrawn);
        }

      } else if (coord1[0] === coord2[0] && coord1[1] + 1 === coord2[1]) {
        if (!edgeflg &&
          rgrid.get(coord1[0], coord1[1], gridExcept) !== stateDrawn) {
          rgrid.set(coord1[0], coord1[1], stateForbidden);
        } else if (cellflg && edgeflg) {
          rgrid.set(coord1[0], coord1[1], stateDrawn);
        }
      }
    }
  }

  static applyDiagonalTheoryWith0(cell, rgrid, cgrid) {
    let coord = initCellCoord.concat();

    for (;;) {
      coord = SlitherUtils.searchCell(cell, cellZero, coord);

      // No cell is left
      if (coord === null) {
        return true;
      }

      const dcell = SlitherUtils.getDiagonalCell(cell, coord);
      const grid = SlitherUtils.getDiagonalGrid(rgrid, cgrid, coord);

      // Check diagonal cell
      for (let i = 0; i < cellNumberLength; i += 1) {
        const didx = i * diagonalGridPerCell;

        // If diagonal cell is 1, all diagonal grid is forbidden
        if (dcell[i] === cellOne) {
          if (grid[didx] === stateDrawn ||
            grid[didx + 1] === stateDrawn) {

            return false;
          }
          grid[didx] = stateForbidden;
          grid[didx + 1] = stateForbidden;

        // If diagonal cell is 3, all diagonal grid is drawn
        } else if (dcell[i] === cellThree) {
          if (grid[didx] === stateForbidden ||
            grid[didx + 1] === stateForbidden) {

            return false;
          }
          grid[didx] = stateDrawn;
          grid[didx + 1] = stateDrawn;

        }
      }

      SlitherUtils.setDiagonalGrid(rgrid, cgrid, coord, grid);
    }
  }

  static applyDiagonalTheoryWith1(cell, rgrid, cgrid) {
    let coord = initCellCoord.concat();

    for (;;) {
      coord = SlitherUtils.searchCell(cell, cellOne, coord);
      // No cell is left
      if (coord === null) {
        return true;
      }

      const dgrid = SlitherUtils.getDiagonalGrid(rgrid, cgrid, coord);
      const grid = SlitherUtils.getCellGrid(rgrid, cgrid, coord);

      for (let i = 0; i < cellNumberLength; i += 1) {
        const grid1 = dgrid[i * diagonalGridPerCell];
        const grid2 = dgrid[i * diagonalGridPerCell + 1];

        if (grid1 === stateDrawn && grid2 === stateForbidden ||
          grid1 === stateForbidden && grid2 === stateDrawn) {
          if (grid[diagonalOpposit[i][0]] === stateDrawn ||
            grid[diagonalOpposit[i][1]] === stateDrawn) {
            return false;
          }

          grid[diagonalOpposit[i][0]] = stateForbidden;
          grid[diagonalOpposit[i][1]] = stateForbidden;
        }
      }

      SlitherUtils.setCellGrid(rgrid, cgrid, coord, grid);
    }
  }

  static applyDiagonalTheoryWith2(cell, rgrid, cgrid) {
    let coord = initCellCoord.concat();

    for (;;) {
      coord = SlitherUtils.searchCell(cell, cellTwo, coord);

      // No cell is left
      if (coord === null) {
        return true;
      }

      const grid = SlitherUtils.getDiagonalGrid(rgrid, cgrid, coord);
      for (let i = 0; i < cellNumberLength; i += 1) {
        const grid1 = grid[i * diagonalGridPerCell];
        const grid2 = grid[i * diagonalGridPerCell + 1];

        if (grid1 === stateForbidden && grid2 === stateForbidden) {
          const flg = diagonalBeside[i].map(([
            idx1,
            idx2,
          ]) => {
            if (grid[idx1] !== stateUndef && grid[idx1] === grid[idx2]) {
              return false;
            }

            if (grid[idx1] === stateForbidden &&
              grid[idx2] === stateUndef) {
              grid[idx2] = stateDrawn;
            } else if (grid[idx2] === stateForbidden &&
              grid[idx1] === stateUndef) {
              grid[idx1] = stateDrawn;
            }

            return true;
          }).includes(false);

          if (flg) {
            return false;
          }

          SlitherUtils.setDiagonalGrid(rgrid, cgrid, coord, grid);
        }
      }
    }
  }

  static isDiagonal2Connect3(rgrid, cgrid, coord, idx) {
    const newCoord = [
      coord[0] + diagonalCellCoord[idx][0],
      coord[1] + diagonalCellCoord[idx][1],
    ];
    const grid = SlitherUtils.getDiagonalGrid(rgrid, cgrid, newCoord);
    const bes = diagonalBeside[idx];

    return grid[bes[0][0]] === stateForbidden &&
      grid[bes[0][1]] === stateForbidden ||
      grid[bes[1][0]] === stateForbidden &&
        grid[bes[1][1]] === stateForbidden;
  }

  static isDiagonal1Connect3(rgrid, cgrid, coord, idx) {
    const newCoord = [
      coord[0] + diagonalCellCoord[idx][0],
      coord[1] + diagonalCellCoord[idx][1],
    ];
    const grid = SlitherUtils.getCellGrid(rgrid, cgrid, newCoord);

    const opp = diagonalOpposit[maxGridIndex - idx];
    return grid[opp[0]] === stateForbidden && grid[opp[1]] === stateForbidden;
  }

  static setDiagonal3CellGrid(rgrid, cgrid, coord, idx) {
    const dgrid = SlitherUtils.getCellGrid(rgrid, cgrid, coord);
    const opp = diagonalOpposit[idx];
    if (dgrid[opp[0]] === stateForbidden ||
      dgrid[opp[1]] === stateForbidden) {
      return false;
    }

    dgrid[opp[0]] = stateDrawn;
    dgrid[opp[1]] = stateDrawn;
    SlitherUtils.setCellGrid(rgrid, cgrid, coord, dgrid);

    return true;
  }

  static applyDiagonalTheoryWith3(cell, rgrid, cgrid) {
    let coord = initCellCoord.concat();

    for (;;) {
      coord = SlitherUtils.searchCell(cell, cellThree, coord);

      // No cell is found
      if (coord === null) {
        return true;
      }

      const grid = SlitherUtils.getDiagonalGrid(rgrid, cgrid, coord);
      const dcell = SlitherUtils.getDiagonalCell(cell, coord);

      for (let i = 0; i < cellNumberLength; i += 1) {
        const didx = i * diagonalGridPerCell;
        // Diagonal cell is 3 or vertex has grid
        // Or diagonal cell is 2 and its grid will connect to 3 vertex
        // Or diagonal cell is 1 and its grid will connect to 3 vertex
        if (dcell[i] === cellThree ||
          grid[didx] === stateDrawn ||
          grid[didx + 1] === stateDrawn ||
          dcell[i] === cellTwo &&
            this.isDiagonal2Connect3(rgrid, cgrid, coord, i) ||
          dcell[i] === cellOne &&
            this.isDiagonal1Connect3(rgrid, cgrid, coord, i)) {
          if (!this.setDiagonal3CellGrid(rgrid, cgrid, coord, i)) {
            return false;
          }
        }

        if (grid[didx] === stateForbidden &&
          grid[didx + 1] === stateForbidden) {
          const vertex = [
            coord[0] + vertexPos[i][0],
            coord[1] + vertexPos[i][1],
          ];
          let vgrid = SlitherUtils.getVertexGrid(rgrid, cgrid, vertex);

          vgrid = SlitherUtils.setGridValue(vgrid, stateDrawn);
          SlitherUtils.setVertexGrid(rgrid, cgrid, vertex, vgrid);
        }
      }
    }
  }

  static applyCrossTheoryWith3(cell, rgrid, cgrid) {
    let coord = initCellCoord.concat();

    for (;;) {
      coord = SlitherUtils.searchCell(cell, cellThree, coord);
      // No cell is found
      if (coord === null) {
        return true;
      }

      const ccell = SlitherUtils.getCrossCell(cell, coord);
      const grid = SlitherUtils.getCellGrid(rgrid, cgrid, coord);

      for (let i = 0; i < grid.length; i += 1) {
        if (ccell[i] === cellThree) {
          const j = (i + diagonalGridPerCell) % cellNumberLength;

          if (grid[i] === stateForbidden || grid[j] === stateForbidden) {
            return false;
          }

          grid[i] = stateDrawn;
          grid[j] = stateDrawn;
        }
      }

      SlitherUtils.setCellGrid(rgrid, cgrid, coord, grid);
    }
  }

  static definiteLoop(cell, rgrid, cgrid) {
    const result = {
      rgrid: new Matrix(rgrid),
      cgrid: new Matrix(cgrid),
    };

    if (!this.setGridWithCell(cell, result.rgrid, result.cgrid)) {
      result.error = 'failed in grid around cell';
    } else if (
      !this.setGridWithVertex(result.rgrid, result.cgrid)) {
      result.error = 'faild in grid around vertex';
    } else if (
      !this.applyDiagonalTheoryWith0(cell, result.rgrid, result.cgrid)) {
      result.error = 'failed in diagonal theory with 0';
    } else if (
      !this.applyDiagonalTheoryWith1(cell, result.rgrid, result.cgrid)) {
      result.error = 'failed in diagonal theory with 1';
    } else if (
      !this.applyDiagonalTheoryWith2(cell, result.rgrid, result.cgrid)) {
      result.error = 'failed in diagonal theory with 2';
    } else if (
      !this.applyDiagonalTheoryWith3(cell, result.rgrid, result.cgrid)) {
      result.error = 'failed in diagonal theory with 3';
    } else if (
      !this.applyCrossTheoryWith3(cell, result.rgrid, result.cgrid)) {
      result.error = 'failed in cross theory with 3';
    } else if (
      !this.setGridWithEdgePair(cell, result.rgrid, result.cgrid)) {
      result.error = 'failed in edge pair';
    }

    return result;
  }

  static run(cell, rgrid, cgrid) {
    let row = new Matrix(rgrid);
    let col = new Matrix(cgrid);
    let result;

    for (;;) {
      result = this.definiteLoop(cell, row, col);

      if (result.error !== undefined) {
        return result;
      }
      if (row.equals(result.rgrid) && col.equals(result.cgrid)) {
        break;
      }

      row = result.rgrid;
      col = result.cgrid;
    }

    if (SlitherUtils.searchEdge(row, col, initEdgeCoord) === null &&
      !SlitherUtils.isSatisfiedAboutCircle(row, col)) {
      result.error = 'multiple circle';
    }
    return result;
  }

}
