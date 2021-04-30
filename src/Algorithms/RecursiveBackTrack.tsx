import React, {useContext, useEffect, useRef, useState} from 'react';
import {GridElement, GridContextProps} from '../types/GridTypes';
import {GridContext} from '../context/GridContext';
import GridOperations, {Neighbors} from '../components/GridOperations';

const RecursiveBackTrack: React.FC<{
	startRow?: number;
	startColumn?: number;
	mazeBorderColor: string;
}> = ({startRow, startColumn, mazeBorderColor}) => {
	const {
		gridStructure,
		updateGridStructure,
		updateMazeComplete,
		resetingGrid,
		setResetingGrid,
	} = useContext<GridContextProps>(GridContext);
	const grid_structure = useRef<GridElement[][]>(gridStructure);
	const mount = useRef<number>(0);
	const gridOp = new GridOperations(grid_structure);
	const time = useRef<number>(2);
	const [curNodeSetColor, updateCurNodeSetColor] = useState<GridElement>();

	const isAllNeighborsVisited = (neighbors: Neighbors): boolean => {
		for (const neighbor of Object.values(neighbors)) {
			if (neighbor) {
				if (!gridOp.visited[gridOp.getGridElementIndex(neighbor)]) return false;
			}
		}

		return true;
	};

	// removes the wall of the current element which joins the randomNeighbor
	const removeNeigborWalls = (
		currentElement: GridElement,
		randomNeighbor: GridElement
	) => {
		if (!randomNeighbor) return;

		let randomNeighborElement: GridElement = Object.values(randomNeighbor)[0];

		if (!gridOp.visited[gridOp.getGridElementIndex(randomNeighborElement)]) {
			let walls: any = {};
			walls[Object.keys(randomNeighbor)[0]] = false;

			gridOp.removeWalls(currentElement.row, currentElement.column, walls);
			updateGridStructure(grid_structure.current);
		}
	};

	const timeout = (delay: number) =>
		new Promise((resolve) => setTimeout(resolve, delay));

	const generateMaze = async (currentElement: GridElement): Promise<void> => {
		if (!currentElement) return new Promise((resolve) => resolve());

		// updateCurNodeSetColor(currentElement);

		if (gridOp.visited[gridOp.getGridElementIndex(currentElement)]) {
			updateCurNodeSetColor(currentElement);
			return new Promise((resolve) => {
				resolve();
			});
		}

		gridOp.visited[gridOp.getGridElementIndex(currentElement)] = true;

		// getting neighboring elements
		let neighbors: Neighbors = gridOp.getNeighborElements(
			currentElement.row,
			currentElement.column
		);

		if (isAllNeighborsVisited(neighbors)) {
			updateCurNodeSetColor(currentElement);
			return new Promise((resolve) => {
				resolve();
			});
		}

		const shuffledNeighbors: {
			[keys: string]: GridElement;
		} = gridOp.shuffleNeigbhors(neighbors);

		await timeout(time.current).then(async () => {
			// to highlight the start element
			updateCurNodeSetColor(currentElement);
			removeNeigborWalls(currentElement, shuffledNeighbors[0]);

			updateCurNodeSetColor(Object.values(shuffledNeighbors[0])[0]);
			removeNeigborWalls(currentElement, shuffledNeighbors[0]);
			await generateMaze(Object.values(shuffledNeighbors[0])[0]);
		});
		await timeout(time.current).then(async () => {
			updateCurNodeSetColor(Object.values(shuffledNeighbors[1])[0]);
			removeNeigborWalls(currentElement, shuffledNeighbors[1]);
			await generateMaze(Object.values(shuffledNeighbors[1])[0]);
		});
		await timeout(time.current).then(async () => {
			updateCurNodeSetColor(Object.values(shuffledNeighbors[2])[0]);
			removeNeigborWalls(currentElement, shuffledNeighbors[2]);
			await generateMaze(Object.values(shuffledNeighbors[2])[0]);
		});
		await timeout(time.current).then(async () => {
			updateCurNodeSetColor(Object.values(shuffledNeighbors[3])[0]);
			removeNeigborWalls(currentElement, shuffledNeighbors[3]);
			await generateMaze(Object.values(shuffledNeighbors[3])[0]);
		});
	};

	useEffect(() => {
		if (resetingGrid) {
			mount.current = -1;
			updateMazeComplete(false);
			timeout(1000).then(() => {
				setResetingGrid(false);
			});
		} else if (gridStructure.length > 0 && mount.current === 0) {
			grid_structure.current = gridStructure;
			if (startRow !== undefined && startColumn !== undefined) {
				console.log('generating maze ...');
				generateMaze(gridStructure[startRow][startColumn]).then(() => {
					console.log('maze has been generated');
					updateMazeComplete(true);
				});
			}
			mount.current++;
		} else if (mount.current === -1) {
			mount.current++;
		}
	}, [startRow, startColumn, resetingGrid]);

	useEffect(() => {
		if (curNodeSetColor) {
			grid_structure.current[curNodeSetColor.row][
				curNodeSetColor.column
			].color = mazeBorderColor;
			updateGridStructure(grid_structure.current);
		}
	}, [curNodeSetColor, grid_structure]);

	return <></>;
};

export default RecursiveBackTrack;
