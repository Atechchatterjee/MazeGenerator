export interface GridElement {
	height: number;
	width: number;
    row: number;
    column: number;
    color?: string;
    walls: {
        left: boolean;
        right:boolean;
        top:boolean;
        bottom:boolean;
    }
}

export interface GridContextProps {
    gridStructure: GridElement[][];
    updateGridStructure: Function;
}


