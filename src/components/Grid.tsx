import React, {useContext, useRef, useEffect} from 'react';
import {GridElement, GridContextProps} from '../types/GridTypes';
import {GridContext} from '../context/GridContext';
import GridOperation from './GridOperations';
import {CircularProgress} from '@material-ui/core';

interface Props {
	clickedCb?: Function;
	mazeBorderColor: string;
}

const Grid: React.FC<Props> = ({clickedCb: callback, mazeBorderColor}) => {
	const {gridStructure, updateGridStructure, resetingGrid} = useContext<
		GridContextProps
	>(GridContext);
	const windowHeight = useRef<number>(window.innerHeight);
	const windowWidth = useRef<number>(window.innerWidth);
	const grid_structure = useRef<GridElement[][]>([]);

	const cellHeight = useRef<number>(30);
	const cellWidth = useRef<number>(30);
	const borderWidth = useRef<number>(1);
	const rows = useRef<number>(
		Math.floor(
			(windowHeight.current * 0.45) / (cellHeight.current + borderWidth.current)
		)
	);
	const column = useRef<number>(
		Math.floor(
			(windowWidth.current * 0.45) / (cellWidth.current + borderWidth.current)
		)
	);
	const mount = useRef<number>(0);
	let gridOp = new GridOperation(grid_structure);

	// creates the grid structure
	const createGridStructure = () => {
		let grid: GridElement[][] = [];

		const gridExists: boolean = gridStructure.length > 0;

		for (let i = 0; i < rows.current; i++) {
			let g = [];
			for (let j = 0; j < column.current; j++) {
				g.push({
					height: cellHeight.current,
					width: cellWidth.current,
					row: i,
					column: j,
					color: '#fff',
					walls: {
						right: gridExists ? gridStructure[i][j].walls.right : true,
						left: gridExists ? gridStructure[i][j].walls.left : true,
						top: gridExists ? gridStructure[i][j].walls.top : true,
						bottom: gridExists ? gridStructure[i][j].walls.bottom : true,
					},
				});
			}
			grid.push(g);
		}

		updateGridStructure(grid);
	};

	useEffect(() => {
		if (mount.current === 0) createGridStructure();
		mount.current++;
		if (gridStructure.length > 0) {
			grid_structure.current = gridStructure;
			gridOp = new GridOperation(grid_structure);
		}
		if (resetingGrid) {
			mount.current = 0;
			updateGridStructure(gridOp.resetGrid());
			createGridStructure();
		}
	}, [resetingGrid, gridStructure, grid_structure]);

	// creating the actual grid
	return (
		<div style={{margin: '8% 25%'}}>
			{resetingGrid ? (
				<CircularProgress
					style={{margin: '22% 45%'}}
					size={40}
					color="secondary"
				/>
			) : (
				<table
					style={{
						border: `${borderWidth.current}px solid black`,
						borderCollapse: 'collapse',
						float: 'left',
					}}
				>
					<tbody>
						{gridStructure.map((rows) => {
							return (
								<tr>
									{rows.map(({width, height, row, column, walls, color}) => {
										return (
											<td
												className="cell"
												onClick={() => {
													if (callback) callback({row, column});
												}}
												id={`${row}-${column}`}
												style={{
													height: `${height}px`,
													width: `${width}px`,
													float: 'left',
													backgroundColor: `${color}`,
													borderCollapse: 'collapse',
													borderLeft: `${
														walls.left
															? borderWidth.current + 'px solid black'
															: borderWidth.current +
															  'px solid ' +
															  mazeBorderColor
													}`,
													borderRight: `${
														walls.right
															? borderWidth.current + 'px solid black'
															: borderWidth.current +
															  'px solid ' +
															  mazeBorderColor
													}`,
													borderTop: `${
														walls.top
															? borderWidth.current + 'px solid black'
															: borderWidth.current +
															  'px solid ' +
															  mazeBorderColor
													}`,
													borderBottom: `${
														walls.bottom
															? borderWidth.current + 'px solid black'
															: borderWidth.current +
															  'px solid ' +
															  mazeBorderColor
													}`,
													cursor: 'pointer',
												}}
											></td>
										);
									})}
								</tr>
							);
						})}
					</tbody>
				</table>
			)}
		</div>
	);
};

export default Grid;
