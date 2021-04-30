import {AppBar, Button, Toolbar, Typography} from '@material-ui/core';
import React, {useContext, useState} from 'react';
import {BlockPicker} from 'react-color';
import {GridContext} from '../context/GridContext';
import {GridContextProps} from '../types/GridTypes';

const NavBar: React.FunctionComponent<{
	selectedColor: string;
	setSelectedColor: Function;
}> = ({selectedColor, setSelectedColor}) => {
	const {setResetingGrid} = useContext<GridContextProps>(GridContext);
	const [toggleColorSelector, setToggleColorSelector] = useState<boolean>(
		false
	);

	return (
		<>
			<AppBar position="static">
				<Toolbar>
					<Typography variant="h6" className="primary" style={{width: '30%'}}>
						Maze Generator
					</Typography>
					<div style={{marginLeft: '75%', width: '25%'}}>
						<Button
							color="inherit"
							onClick={() => setToggleColorSelector(!toggleColorSelector)}
						>
							Pick Color
						</Button>
						<Button
							color="inherit"
							style={{marginLeft: '5%'}}
							onClick={() => {
								setResetingGrid(true);
							}}
						>
							Reset
						</Button>
					</div>
				</Toolbar>
			</AppBar>
			<div style={{float: 'right', marginRight: '4%'}}>
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
		</>
	);
};

export default NavBar;
