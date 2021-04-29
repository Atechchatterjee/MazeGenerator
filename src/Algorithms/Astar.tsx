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
	const gridOp = new GridOperations(grid_structure);

	// gets the neighbors which are not seperated by walls
	const getAvailableNeigbors = (element: GridElement): Neighbors => {
		let availableNeighbors: Neighbors = {};
		const {left, right, top, bottom}: Neighbors = gridOp.getNeighborElements(
			element.row,
			element.column
		);

		if (left?.walls.right === true) availableNeighbors.left = left;
		if (right?.walls.left === true) availableNeighbors.right = right;
		if (bottom?.walls.top === true) availableNeighbors.top = top;
		if (top?.walls.bottom === true) availableNeighbors.top = top;

		return availableNeighbors;
	};

	useEffect(() => {
		if (mazeComplete) {
			grid_structure.current = gridStructure;
             //console.log('available neighbors');
             //console.log(getAvailableNeigbors(grid_structure.current[0][0]));
		}
	}, [gridStructure]);

	return <></>;
};

export default Astar;
