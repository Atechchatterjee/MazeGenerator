import React, {useState, useContext, useRef, useEffect} from 'react';
import {GridElement, GridContextProps} from '../types/GridTypes';
import {GridContext} from '../context/GridContext';

const Grid: React.FC<{callback?: Function}> = ({callback}) => {
	const {gridStructure, updateGridStructure} = useContext<GridContextProps>(
		GridContext
	);

	const rows = useRef<number>(20);
	const column = useRef<number>(20);
	const mount = useRef<number>(0);

	// creates the grid structure
	const createGridStructure = () => {
		let grid: GridElement[][] = [];

		const gridExists: boolean = gridStructure.length > 0;

		for (let i = 0; i < rows.current; i++) {
			let g = [];
			for (let j = 0; j < column.current; j++) {
				g.push({
					height: 30,
					width: 30,
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
	}, [gridStructure]);

	// creating the actual grid
	return (
		<table style={{border: '1px solid black', borderCollapse: 'collapse'}}>
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
											backgroundColor: `${!!color ? color : 'white'}`,
											borderCollapse: 'collapse',
											borderLeft: `${
												walls.left ? '1px solid black' : '1px solid white'
											}`,
											borderRight: `${
												walls.right ? '1px solid black' : '1px solid white'
											}`,
											borderTop: `${
												walls.top ? '1px solid black' : '1px solid white'
											}`,
											borderBottom: `${
												walls.bottom ? '1px solid black' : '1px solid white'
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
	);
};

export default Grid;
