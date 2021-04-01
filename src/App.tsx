import React, {useState} from 'react';
import RecursiveBackTrack from './Algorithms/RecursiveBackTrack';
import Grid from './components/Grid';
import {GridContext} from './context/GridContext';
import './App.css';

const App: React.FC = () => {
	const [gridStructure, updateGridStructure] = useState<any[][]>([]);

	return (
		<div className="main">
			<GridContext.Provider value={{gridStructure, updateGridStructure}}>
				<Grid />
				<RecursiveBackTrack />
			</GridContext.Provider>
		</div>
	);
};

export default App;
