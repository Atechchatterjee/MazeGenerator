import React, {useState, useEffect} from 'react';
import RecursiveBackTrack from './Algorithms/RecursiveBackTrack';
import Grid from './components/Grid';
import Astar from './Algorithms/Astar';
import {GridContext} from './context/GridContext';
import {GridElement} from './types/GridTypes';
import {Snackbar} from '@material-ui/core';
import {Alert} from '@material-ui/lab';
import {BlockPicker} from 'react-color';
import './App.css';
import {Button} from '@material-ui/core';
import NavBar from './components/Navbar';

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
	const [resetingGrid, setResetingGrid] = useState<boolean>(false);
	const [openSnackBar, setOpenStackBar] = useState<boolean>(mazeComplete);
	const vertical = 'top';
	const horizontal = 'center';

	useEffect(() => {
		setOpenStackBar(mazeComplete);
		if (resetingGrid) {
			setSelectedColor('#A0BAD3');
			updateStartColumn(undefined);
			updateStartRow(undefined);
		}
	}, [resetingGrid, mazeComplete]);

	const ColorPicker: React.FC = () => {
		return (
			<Button
				variant="contained"
				color="primary"
				onClick={() => setToggleColorSelector(!toggleColorSelector)}
			>
				Pick Color
			</Button>
		);
	};
	const ResetBtn: React.FC = () => {
		return (
			<Button
				variant="contained"
				color="primary"
				onClick={() => {
					setResetingGrid(true);
					setSelectedColor('#A0BAD3');
					updateStartColumn(undefined);
					updateStartRow(undefined);
				}}
			>
				Reset
			</Button>
		);
	};

	return (
		<div>
			<div className="main">
				<GridContext.Provider
					value={{
						gridStructure,
						updateGridStructure,
						mazeComplete,
						updateMazeComplete,
						resetingGrid,
						setResetingGrid,
					}}
				>
					<NavBar
						selectedColor={selectedColor}
						setSelectedColor={setSelectedColor}
					/>
					<Grid
						clickedCb={({row, column}: {row: number; column: number}) => {
							updateStartRow(row);
							updateStartColumn(column);
							updateMazeComplete(false);
						}}
						mazeBorderColor={selectedColor}
					/>
					<RecursiveBackTrack
						startColumn={startColumn}
						startRow={startRow}
						mazeBorderColor={selectedColor}
					/>
					{mazeComplete ? (
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
						{toggleColorSelector ? (
							<div style={{marginTop: '5%'}}>
								<BlockPicker
									color={selectedColor}
									colors={[
										'#A0BAD3',
										'#37d67a',
										'#ff8a65',
										'#555555',
										'#697689',
									]}
									onChangeComplete={(e: any) => setSelectedColor(e.hex)}
								/>
							</div>
						) : (
							<></>
						)}
					</div>
					<Snackbar
						open={openSnackBar}
						autoHideDuration={3000}
						onClose={() => setOpenStackBar(false)}
						anchorOrigin={{vertical, horizontal}}
					>
						<Alert severity="success">Maze has been Generated!</Alert>
					</Snackbar>
				</GridContext.Provider>
			</div>
		</div>
	);
};

export default App;
