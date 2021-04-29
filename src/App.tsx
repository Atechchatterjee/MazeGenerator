import React, {useState, useRef} from 'react';
import RecursiveBackTrack from './Algorithms/RecursiveBackTrack';
import Grid from './components/Grid';
import Astar from './Algorithms/Astar';
import {GridContext} from './context/GridContext';
import {GridElement} from './types/GridTypes';
import {BlockPicker} from 'react-color';
import './App.css';
import {Button} from '@material-ui/core';

const App: React.FC = () => {
	const [gridStructure, updateGridStructure] = useState<GridElement[][]>([]);
	const [startRow, updateStartRow] = useState<number | undefined>(undefined);
	const [startColumn, updateStartColumn] = useState<number | undefined>(
		undefined
	);
	const [mazeComplete, updateMazeComplete] = useState<boolean>(false);
	const [selectedColor, setSelectedColor] = useState<string>('#A0BAD3');
	const [toggleColorSelector, setToggleColorSelector] = useState<boolean>(
		false
	);

	return (
		<div className="main">
			<GridContext.Provider
				value={{
					gridStructure,
					updateGridStructure,
					mazeComplete,
					updateMazeComplete,
				}}
			>
				<Grid
					callback={({row, column}: {row: number; column: number}) => {
						// alert(row + ' ' + column);
						updateStartRow(row);
						updateStartColumn(column);
					}}
					mazeBorderColor={selectedColor}
				/>
				<RecursiveBackTrack
					startColumn={startColumn}
					startRow={startRow}
					mazeBorderColor={selectedColor}
				/>
				{gridStructure.length > 0 ? (
					<Astar
						startNode={gridStructure[0][0]}
						endNode={
							gridStructure[gridStructure.length - 1][
								gridStructure[0].length - 1
							]
						}
					/>
				) : (
					<></>
				)}
				<div style={{float: 'left', marginLeft: '4%'}}>
					<Button
						variant="contained"
						color="primary"
						onClick={() => setToggleColorSelector(!toggleColorSelector)}
					>
						Pick Color
					</Button>
					{toggleColorSelector ? (
						<div style={{marginTop: '5%'}}>
							<BlockPicker
								color={selectedColor}
								colors={['#A0BAD3', '#37d67a', '#ff8a65', '#555555', '#697689']}
								onChangeComplete={(e: any) => setSelectedColor(e.hex)}
							/>
						</div>
					) : (
						<></>
					)}
				</div>
			</GridContext.Provider>
		</div>
	);
};

export default App;
