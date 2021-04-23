import {useRef} from 'react';
import {GridElement} from '../types/GridTypes';

export interface Neighbors {
	left?: GridElement;
	right?: GridElement;
	top?: GridElement;
	bottom?: GridElement;
}

export default class GridOperation {
	visited: any = {};

	grid_structure: any = {};

	constructor(grid_structure: any) {
		this.grid_structure = grid_structure;
	}

	// changes few properties of the given element
	changeElement = (
		element: GridElement,
		walls?: any,
		color?: string
	): GridElement => {
		if (walls) {
			const row: number = element.row;
			const column: number = element.column;

			return {
				width: element.width,
				height: element.height,
				row: element.row,
				column: element.column,
				walls: {
					// does not change the existing walls
					left:
						walls.left === undefined
							? this.grid_structure.current[row][column].walls.left
							: walls.left,
					right:
						walls.right === undefined
							? this.grid_structure.current[row][column].walls.right
							: walls.right,
					top:
						walls.top === undefined
							? this.grid_structure.current[row][column].walls.top
							: walls.top,
					bottom:
						walls.bottom === undefined
							? this.grid_structure.current[row][column].walls.bottom
							: walls.bottom,
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

	// elements = (left, right, top, bottom)
	getNeighborElements = (row: number, column: number): Neighbors => {
		let neighbors: Neighbors = {};

		if (column > 0)
			neighbors['left'] = this.grid_structure.current[row][column - 1];
		if (column < this.grid_structure.current[0].length - 1)
			neighbors['right'] = this.grid_structure.current[row][column + 1];
		if (row > 0)
			neighbors['top'] = this.grid_structure.current[row - 1][column];
		if (row < this.grid_structure.current.length - 1)
			neighbors['bottom'] = this.grid_structure.current[row + 1][column];

		return neighbors;
	};

	// removes a wall and updates the global state: gridStructure
	removeWalls = (row: number, column: number, walls: any) => {
		let element: GridElement = this.grid_structure.current[row][column];
		let newGrid: GridElement[][] = [];

		const {left, right, top, bottom} = walls;
		// removing walls of current element
		const elementToBeChanged: GridElement = this.changeElement(element, walls);

		// removing walls from the adjacent elements
		for (const row of this.grid_structure.current) {
			let newRow = [];

			for (let currentElement of row) {
				let changedElement: GridElement = currentElement;
				let flag = false; // to check if any wall is removed from adjacent element

				if (left === false && this.isLeft(elementToBeChanged, currentElement)) {
					changedElement = this.changeElement(currentElement, {
						right: false,
					});
					flag = true;
				}

				if (
					right === false &&
					this.isRight(elementToBeChanged, currentElement)
				) {
					changedElement = this.changeElement(currentElement, {
						left: false,
					});
					flag = true;
				}

				if (
					bottom === false &&
					this.isBottom(elementToBeChanged, currentElement)
				) {
					changedElement = this.changeElement(currentElement, {
						top: false,
					});
					flag = true;
				}

				if (top === false && this.isTop(elementToBeChanged, currentElement)) {
					changedElement = this.changeElement(currentElement, {
						bottom: false,
					});
					flag = true;
				}

				if (this.isSameElement(currentElement, elementToBeChanged)) {
					newRow.push(elementToBeChanged);
				} else if (flag) {
					// when the walls of the adjacent elements is changed
					newRow.push(changedElement);
				} else {
					newRow.push(currentElement);
				}
			}

			newGrid.push(newRow);
		}

		this.grid_structure.current = newGrid;
	};

	allNeighborsVisited = (neighbors: Neighbors): boolean => {
		for (const neighbor of Object.values(neighbors)) {
			if (neighbor) {
				if (!this.visited[this.getGridElementIndex(neighbor)]) return false;
			}
		}

		return true;
	};
	// checks position w.r.t current element
	isLeft = (current: GridElement, element: GridElement): boolean =>
		current.row === element.row && current.column - 1 === element.column;
	isRight = (current: GridElement, element: GridElement): boolean =>
		current.row === element.row && current.column + 1 === element.column;
	isTop = (current: GridElement, element: GridElement): boolean =>
		current.row - 1 === element.row && current.column === element.column;
	isBottom = (current: GridElement, element: GridElement): boolean =>
		current.row + 1 === element.row && current.column === element.column;

	isSameElement = (element1: GridElement, element2: GridElement): boolean =>
		element1.row === element2.row && element1.column === element2.column;

	getGridElementIndex = (element: GridElement | undefined): string => {
		if (!element) return '';
		return `${element.row}-${element.column}`;
	};

	shuffleArray = (elements: any[]): any[] => {
		for (let i = elements.length - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i + 1));
			let temp = elements[i];
			elements[i] = elements[j];
			elements[j] = temp;
		}

		return elements;
	};

	// shuffling the array of neighboring elements
	shuffleNeigbhors = (neighbors: Neighbors) => {
		const {left, right, bottom, top} = neighbors;
		const result: any = [];

		let elementMap = [left, right, bottom, top];
		const indexMap: {[keys: number]: string} = {
			0: 'left',
			1: 'right',
			2: 'bottom',
			3: 'top',
		};
		let shuffledElementIndices = this.shuffleArray([0, 1, 2, 3]);

		shuffledElementIndices.forEach((index: number) => {
			let obj: any = {};
			obj[indexMap[index]] = elementMap[index];
			result.push(obj);
		});

		return result;
	};
}
