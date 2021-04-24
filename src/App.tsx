import React, {useState} from 'react';
import RecursiveBackTrack from './Algorithms/RecursiveBackTrack';
import Grid from './components/Grid';
import {GridContext} from './context/GridContext';
import './App.css';

const App: React.FC = () => {
	const [gridStructure, updateGridStructure] = useState<any[][]>([]);
	const [startRow, updateStartRow] = useState<number | undefined>(undefined);
	const [startColumn, updateStartColumn] = useState<number | undefined>(
		undefined
	);

	return (
		<div className="main">
			<GridContext.Provider value={{gridStructure, updateGridStructure}}>
				<Grid
					callback={({row, column}: {row: number; column: number}) => {
						// alert(row + ' ' + column);
						updateStartRow(row);
						updateStartColumn(column);
					}}
				/>
				<RecursiveBackTrack startColumn={startColumn} startRow={startRow} />
			</GridContext.Provider>
		</div>
	);
};

export default App;
