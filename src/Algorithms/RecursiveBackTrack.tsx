import React, { useContext, useEffect, useRef } from "react";
import { GridElement, GridContextProps } from "../types/GridTypes";
import { GridContext } from "../context/GridContext";

interface Neighbors {
  left?: GridElement;
  right?: GridElement;
  top?: GridElement;
  bottom?: GridElement;
}

interface Hash {
  [key: number]: GridElement | undefined;
}


// checks position w.r.t current element
const isLeft = (current: GridElement, element: GridElement): boolean =>
  current.row === element.row && current.column - 1 === element.column;
const isRight = (current: GridElement, element: GridElement): boolean =>
  current.row === element.row && current.column + 1 === element.column;
const isTop = (current: GridElement, element: GridElement): boolean =>
  current.row - 1 === element.row && current.column === element.column;
const isBottom = (current: GridElement, element: GridElement): boolean =>
  current.row + 1 === element.row && current.column === element.column;

const isSameElement = (element1: GridElement, element2: GridElement): boolean =>
  element1.row === element2.row && element1.column === element2.column;

const changeElement = (
  element: GridElement,
  walls?: any,
  color?: string
): GridElement => {
  if (walls) {
    return {
      width: element.width,
      height: element.height,
      row: element.row,
      column: element.column,
      walls: {
        // does not change the existing walls
        left: walls.left === undefined ? element.walls.left : walls.left,
        right: walls.right === undefined ? element.walls.right : walls.right,
        top: walls.top === undefined ? element.walls.top : walls.top,
        bottom:
          walls.bottom === undefined ? element.walls.bottom : walls.bottom,
      },
    };
  }

  if (!!color) {
    return {
      width: element.width,
      height: element.height,
      row: element.row,
      column: element.column,
      walls: walls,
      color: color,
    };
  }

  return element;
};

const getGridElementIndex = (element: GridElement | undefined): string => {
  if (!element) return "";
  return `${element.row}-${element.column}`;
};

const shuffleArray = (elements: any[]): any[] => {
  for (let i = elements.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = elements[i];
    elements[i] = elements[j];
    elements[j] = temp;
  }

  return elements;
};

const RecursiveBackTrack: React.FC = () => {
  const { gridStructure, updateGridStructure } = useContext<GridContextProps>(
    GridContext
  );
  const grid_structure = useRef<GridElement[][]>(gridStructure);
  const visited = useRef<any>({});
  const mount = useRef<number>(0);

  // elements = (left, right, top, bottom)
  const getNeighborElements = (row: number, column: number): Neighbors => {
    let neighbors: Neighbors = {};

    if (column > 0) neighbors["left"] = gridStructure[row][column - 1];
    if (column < gridStructure[0].length - 1)
      neighbors["right"] = gridStructure[row][column + 1];
    if (row > 0) neighbors["top"] = gridStructure[row - 1][column];
    if (row < gridStructure.length - 1)
      neighbors["bottom"] = gridStructure[row + 1][column];

    return neighbors;
  };

  // changes an element and updates the global gridStructure
  const removeWalls = (element: GridElement, walls: any) => {
    let newGrid: GridElement[][] = [];

    const { left, right, top, bottom } = walls;
    const elementToChange: GridElement = changeElement(element, walls);

    for (const row of grid_structure.current) {
      let newRow = [];

      for (let element of row) {
        let changedElement: GridElement = element;
        let flag = false; // check if any wall is removed from adjacent element

        // removing walls from the adjacent elements
        if (left === false && isLeft(elementToChange, element)) {
          changedElement = changeElement(element, { right: false });
          flag = true;
        }

        if (right === false && isRight(elementToChange, element)) {
          changedElement = changeElement(element, { left: false });
          flag = true;
        }

        if (bottom === false && isBottom(elementToChange, element)) {
          changedElement = changeElement(element, { top: false });
          flag = true;
        }

        if (top === false && isTop(elementToChange, element)) {
          changedElement = changeElement(element, { bottom: false });
          flag = true;
        }

        if (isSameElement(element, elementToChange)) {
          newRow.push(elementToChange);
        } else if (flag) {
          newRow.push(changedElement);
        } else {
          newRow.push(element);
        }
      }

      newGrid.push(newRow);
    }

    grid_structure.current = newGrid;
    updateGridStructure(grid_structure.current);
  };

  const pickRandomNeigbors = (neighbors:Neighbors) => {
    const {left, right, bottom, top} = neighbors;
    const result:any = [];

    let elementMap = [left, right, bottom, top];
    let shuffledElementIndices = shuffleArray([0,1,2,3]);

    shuffledElementIndices.forEach((index: number) => {
      result.push(elementMap[index]);
    });

    return result;
  }

  // recursively generates a maze
  const generateMaze = (currentElement: GridElement) => {
      // getting neighboring elements
      let neighbors: any = getNeighborElements(currentElement.row, currentElement.column);

      visited.current[getGridElementIndex(currentElement)] = true;

      console.log(pickRandomNeigbors(neighbors));

    return;
  };

  useEffect(() => {
    if (gridStructure.length > 0 && mount.current === 0) {
      grid_structure.current = gridStructure;
      generateMaze(gridStructure[0][0]);

      mount.current++;
    }
  });

  return <></>;
};

export default RecursiveBackTrack;
