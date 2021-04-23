import React, {useContext, useEffect, useRef} from 'react';
import {GridElement, GridContextProps} from '../types/GridTypes';
import {GridContext} from '../context/GridContext';

interface Neighbors {
	left?: GridElement;
	right?: GridElement;
	top?: GridElement;
	bottom?: GridElement;
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

const getGridElementIndex = (element: GridElement | undefined): string => {
	if (!element) return '';
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

// shuffling the array of neighboring elements
const shuffleNeigbhors = (neighbors: Neighbors) => {
	const {left, right, bottom, top} = neighbors;
	const result: any = [];

	let elementMap = [left, right, bottom, top];
	const indexMap: {[keys: number]: string} = {
		0: 'left',
		1: 'right',
		2: 'bottom',
		3: 'top',
	};
	let shuffledElementIndices = shuffleArray([0, 1, 2, 3]);

	shuffledElementIndices.forEach((index: number) => {
		let obj: any = {};
		obj[indexMap[index]] = elementMap[index];
		result.push(obj);
	});

	return result;
};

const RecursiveBackTrack: React.FC = () => {
	const {gridStructure, updateGridStructure} = useContext<GridContextProps>(
		GridContext
	);
	const grid_structure = useRef<GridElement[][]>(gridStructure);
	const visited = useRef<any>({});
	const mount = useRef<number>(0);

	// changes few properties of the given element
	const changeElement = (
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
							? grid_structure.current[row][column].walls.left
							: walls.left,
					right:
						walls.right === undefined
							? grid_structure.current[row][column].walls.right
							: walls.right,
					top:
						walls.top === undefined
							? grid_structure.current[row][column].walls.top
							: walls.top,
					bottom:
						walls.bottom === undefined
							? grid_structure.current[row][column].walls.bottom
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
	const getNeighborElements = (row: number, column: number): Neighbors => {
		let neighbors: Neighbors = {};

		if (column > 0) neighbors['left'] = gridStructure[row][column - 1];
		if (column < gridStructure[0].length - 1)
			neighbors['right'] = gridStructure[row][column + 1];
		if (row > 0) neighbors['top'] = gridStructure[row - 1][column];
		if (row < gridStructure.length - 1)
			neighbors['bottom'] = gridStructure[row + 1][column];

		return neighbors;
	};

	// removes a wall and updates the global state: gridStructure
	const removeWalls = (row: number, column: number, walls: any) => {
		let element: GridElement = gridStructure[row][column];
		let newGrid: GridElement[][] = [];

		const {left, right, top, bottom} = walls;
		// removing walls of current element
		const elementToBeChanged: GridElement = changeElement(element, walls);

		// removing walls from the adjacent elements
		for (const row of grid_structure.current) {
			let newRow = [];

			for (let currentElement of row) {
				let changedElement: GridElement = currentElement;
				let flag = false; // to check if any wall is removed from adjacent element

				if (left === false && isLeft(elementToBeChanged, currentElement)) {
					changedElement = changeElement(currentElement, {
						right: false,
					});
					flag = true;
				}

				if (right === false && isRight(elementToBeChanged, currentElement)) {
					changedElement = changeElement(currentElement, {
						left: false,
					});
					flag = true;
				}

				if (bottom === false && isBottom(elementToBeChanged, currentElement)) {
					changedElement = changeElement(currentElement, {
						top: false,
					});
					flag = true;
				}

				if (top === false && isTop(elementToBeChanged, currentElement)) {
					changedElement = changeElement(currentElement, {
						bottom: false,
					});
					flag = true;
				}

				if (isSameElement(currentElement, elementToBeChanged)) {
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

		grid_structure.current = newGrid;
	};

	const allNeighborsVisited = (neighbors: Neighbors): boolean => {
		for (const neighbor of Object.values(neighbors)) {
			if (neighbor) {
				if (!visited.current[getGridElementIndex(neighbor)]) return false;
			}
		}

		return true;
	};

	const generateMaze = (currentElement: GridElement) => {
		if (!currentElement) {
			return;
		}

		// getting neighboring elements
		let neighbors: Neighbors = getNeighborElements(
			currentElement.row,
			currentElement.column
		);

		if (allNeighborsVisited(neighbors)) {
			return;
		}

		const shuffledNeighbors: {[keys: string]: GridElement} = shuffleNeigbhors(
			neighbors
		);

		// picking a random neighbor
		const randomNeighbor: GridElement = shuffledNeighbors[0];
		let randomNeighborElement: GridElement = Object.values(randomNeighbor)[0];

		// removing a wall of the current element to visit the randomNeighbor
		if (!visited.current[getGridElementIndex(randomNeighborElement)]) {
			let walls: any = {};
			walls[Object.keys(randomNeighbor)[0]] = false;
			updateGridStructure(grid_structure.current);

			if (randomNeighborElement)
				removeWalls(
					randomNeighborElement.row,
					randomNeighborElement.column,
					walls
				);

			visited.current[getGridElementIndex(randomNeighborElement)] = true;
		}

		console.log(shuffledNeighbors);

		setTimeout(() => generateMaze(Object.values(shuffledNeighbors[1])[0]), 300);
		setTimeout(() => generateMaze(Object.values(shuffledNeighbors[2])[0]), 500);
		setTimeout(
			() => generateMaze(Object.values(shuffledNeighbors[3])[0]),
			1000
		);
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
