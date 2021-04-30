import {createContext} from 'react';
import {GridContextProps, GridElement} from '../types/GridTypes';

export const GridContext = createContext<GridContextProps>({
    gridStructure: [],
    updateGridStructure: () => {},
    mazeComplete: false,
    updateMazeComplete: () => {},
    resetingGrid: false,
    setResetingGrid: () => {}
}) 