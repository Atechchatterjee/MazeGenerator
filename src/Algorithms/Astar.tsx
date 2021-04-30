import React, {useContext, useEffect, useRef} from 'react';
import {GridElement, GridContextProps} from '../types/GridTypes';
import {GridContext} from '../context/GridContext';
import GridOperations, {Neighbors} from '../components/GridOperations';

interface Coordinates {
	x: number;
	y: number;
}

interface q {
	index: number;
	h_cost: number;
	g_cost: number;
}

interface Props {
	startNode: GridElement;
	endNode: GridElement;
}

const Astar: React.FunctionComponent<Props> = (startNode, endNode) => {
	const {gridStructure, updateGridStructure, mazeComplete} = useContext<
		GridContextProps
	>(GridContext);
	const grid_structure = useRef<GridElement[][]>([]);
	let gridOp = new GridOperations(grid_structure);

	// gets the neighbors which are not seperated by walls
	const getAvailableNeigbors = (element: GridElement): Neighbors => {
		let availableNeighbors: Neighbors = {};
		const {left, right, top, bottom}: Neighbors = gridOp.getNeighborElements(
			element.row,
			element.column
		);

		if (element.walls.left === false) availableNeighbors.left = left;
		if (element.walls.right === false) availableNeighbors.right = right;
		if (element.walls.top === false) availableNeighbors.top = top;
		if (element.walls.bottom === false) availableNeighbors.bottom = bottom;

		return availableNeighbors;
	};

	useEffect(() => {
		if (mazeComplete) {
			grid_structure.current = gridStructure;
		}
	}, [mazeComplete, gridStructure]);

	return <></>;
};

export default Astar;
