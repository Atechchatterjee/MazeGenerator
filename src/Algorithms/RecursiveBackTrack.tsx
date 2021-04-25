import React, {useContext, useEffect, useRef} from 'react';
import {GridElement, GridContextProps} from '../types/GridTypes';
import {GridContext} from '../context/GridContext';
import GridOperations, {Neighbors} from '../components/GridOperations';

const RecursiveBackTrack: React.FC<{
	startRow?: number;
	startColumn?: number;
}> = ({startRow, startColumn}) => {
	const {gridStructure, updateGridStructure} = useContext<GridContextProps>(
		GridContext
	);
	const grid_structure = useRef<GridElement[][]>(gridStructure);
	const mount = useRef<number>(0);
	const gridOp = new GridOperations(grid_structure);

	const allNeighborsVisited = (neighbors: Neighbors): boolean => {
		for (const neighbor of Object.values(neighbors)) {
			if (neighbor) {
				if (!gridOp.visited[gridOp.getGridElementIndex(neighbor)]) return false;
			}
		}

		return true;
	};

	const removeNeigborWalls = (
		currentElement: GridElement,
		randomNeighbor: GridElement
	) => {
		if (!randomNeighbor) return;

		let randomNeighborElement: GridElement = Object.values(randomNeighbor)[0];

		// removing a wall of the current element to visit the randomNeighbor
		if (!gridOp.visited[gridOp.getGridElementIndex(randomNeighborElement)]) {
			let walls: any = {};
			walls[Object.keys(randomNeighbor)[0]] = false;

			gridOp.removeWalls(currentElement.row, currentElement.column, walls);
			updateGridStructure(grid_structure.current);
		}
	};

	const generateMaze = (currentElement: GridElement) => {
		if (!currentElement) {
			return;
		}

		// if current element is not visited => return
		if (gridOp.visited[gridOp.getGridElementIndex(currentElement)]) return;

		gridOp.visited[gridOp.getGridElementIndex(currentElement)] = true;

		const originalColor =
			grid_structure.current[currentElement.row][currentElement.column].color;

		grid_structure.current[currentElement.row][currentElement.column].color =
			'#8896E0';

		// getting neighboring elements
		let neighbors: Neighbors = gridOp.getNeighborElements(
			currentElement.row,
			currentElement.column
		);

		if (allNeighborsVisited(neighbors)) {
			grid_structure.current[currentElement.row][
				currentElement.column
			].color = originalColor;
			return;
		}

		const shuffledNeighbors: {
			[keys: string]: GridElement;
		} = gridOp.shuffleNeigbhors(neighbors);

		// picking a random neighbor
		const randomNeighbor: GridElement = shuffledNeighbors[0];

		const time = 200;
		setTimeout(() => {
			removeNeigborWalls(currentElement, randomNeighbor);
			generateMaze(Object.values(shuffledNeighbors[0])[0]);
			setTimeout(() => {
				grid_structure.current[currentElement.row][
					currentElement.column
				].color = originalColor;
				removeNeigborWalls(currentElement, shuffledNeighbors[1]);
				generateMaze(Object.values(shuffledNeighbors[1])[0]);

				setTimeout(() => {
					grid_structure.current[currentElement.row][
						currentElement.column
					].color = originalColor;
					removeNeigborWalls(currentElement, shuffledNeighbors[2]);
					generateMaze(Object.values(shuffledNeighbors[2])[0]);

					setTimeout(() => {
						removeNeigborWalls(currentElement, shuffledNeighbors[3]);
						generateMaze(Object.values(shuffledNeighbors[3])[0]);
					}, time);
				}, time);
			}, time);
		}, time);
	};

	useEffect(() => {
		if (gridStructure.length > 0 && mount.current === 0) {
			grid_structure.current = gridStructure;
			if (startRow !== undefined && startColumn !== undefined)
				generateMaze(gridStructure[startRow][startColumn]);
			mount.current++;
		}
	}, [startRow, startColumn, grid_structure]);

	return <></>;
};

export default RecursiveBackTrack;
