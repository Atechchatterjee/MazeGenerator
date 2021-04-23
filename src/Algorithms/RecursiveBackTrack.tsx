import React, {useContext, useEffect, useRef} from 'react';
import {GridElement, GridContextProps} from '../types/GridTypes';
import {GridContext} from '../context/GridContext';
import GridOperations, {Neighbors} from '../components/GridOperations';

const RecursiveBackTrack: React.FC = () => {
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

	const generateMaze = (currentElement: GridElement) => {
		if (!currentElement) {
			return;
		}

		// getting neighboring elements
		let neighbors: Neighbors = gridOp.getNeighborElements(
			currentElement.row,
			currentElement.column
		);

		if (allNeighborsVisited(neighbors)) {
			return;
		}

		const shuffledNeighbors: {
			[keys: string]: GridElement;
		} = gridOp.shuffleNeigbhors(neighbors);

		// picking a random neighbor
		const randomNeighbor: GridElement = shuffledNeighbors[0];
		let randomNeighborElement: GridElement = Object.values(randomNeighbor)[0];

		// removing a wall of the current element to visit the randomNeighbor
		if (!gridOp.visited[gridOp.getGridElementIndex(randomNeighborElement)]) {
			let walls: any = {};
			walls[Object.keys(randomNeighbor)[0]] = false;

			if (randomNeighborElement) {
				gridOp.removeWalls(
					randomNeighborElement.row,
					randomNeighborElement.column,
					walls
				);
				updateGridStructure(grid_structure.current);
				gridOp.visited[
					gridOp.getGridElementIndex(randomNeighborElement)
				] = true;
			}
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
