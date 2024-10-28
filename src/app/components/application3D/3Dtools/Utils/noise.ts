export class noise {
    private lookupTable:number[][][];
    private size: number = 10;

    constructor(size: number = 20){
        
        let elements = 0;
        this.size = size;
        this.lookupTable = [];
        for (let index = 0; index < this.size; index++) {
            this.lookupTable[index] = [];
            for (let indexB = 0; indexB < this.size; indexB++) {
                this.lookupTable[index][indexB] = [];
                for (let indexC = 0; indexC < this.size; indexC++) {
                    this.lookupTable[index][indexB][indexC] = 0.5;
                    elements++;
                }
            }
        }
        this.createLookupTable(this.size);
    }
    public noise = (x: number, y: number, z: number = 0): number =>{//, iterations: number, scale: number
        let is3D: boolean = z != null;
        is3D;
        let sizeMinusOne = this.size - 1;//Array is zero based
        let modX = Math.max(0, x%sizeMinusOne);
        let modY = Math.max(0, y%sizeMinusOne);
        let modZ = Math.max(0, z%sizeMinusOne);
        //console.log("modX: ", modX);
        let fracX = x%1;
        let fracY = y%1;
        let fracZ = z%1;

        let squareFTL = this.lookupTable[Math.floor(modX)][Math.floor(modY)][Math.floor(modZ)];
        let squareFTR = this.lookupTable[Math.ceil(modX)][Math.floor(modY)][Math.floor(modZ)];
        let squareFBL = this.lookupTable[Math.floor(modX)][Math.ceil(modY)][Math.floor(modZ)];
        let squareFBR = this.lookupTable[Math.ceil(modX)][Math.ceil(modY)][Math.floor(modZ)];

        let squareBTL = this.lookupTable[Math.floor(modX)][Math.floor(modY)][Math.ceil(modZ)];
        let squareBTR = this.lookupTable[Math.ceil(modX)][Math.floor(modY)][Math.ceil(modZ)];
        let squareBBL = this.lookupTable[Math.floor(modX)][Math.ceil(modY)][Math.ceil(modZ)];
        let squareBBR = this.lookupTable[Math.ceil(modX)][Math.ceil(modY)][Math.ceil(modZ)];

        let lerpTLTR = this.lerp(squareFTL, squareFTR, fracX);
        let lerpBLBR = this.lerp(squareFBL, squareFBR, fracX);
        let lerpFTB = this.lerp(lerpTLTR, lerpBLBR, fracY);

        let lerpBTLBTR = this.lerp(squareBTL, squareBTR, fracX);
        let lerpBBLBBR = this.lerp(squareBBL, squareBBR, fracX)
        let lerpBTB = this.lerp(lerpBTLBTR, lerpBBLBBR, fracY);

        let result = this.lerp(lerpFTB, lerpBTB, fracZ);

        return result;
    }

    private createLookupTable(size: number){
        for (let index = 0; index < size; index++) {
            //this.lookupTable[index] = new Array<number>();
            for (let indexB = 0; indexB < size; indexB++) {
                if(index == size - 1){
                    this.lookupTable[index][indexB] = this.lookupTable[0][indexB];//wrap start-end
                }
                if(indexB == size - 1){
                    this.lookupTable[index][indexB] = this.lookupTable[index][0];//wrap start-end
                }
                for (let indexC = 0; indexC < size; indexC++) {
                    this.lookupTable[index][indexB][indexC] = Math.random();
                    if(indexC == size - 1){
                        this.lookupTable[index][indexB][indexC] = this.lookupTable[index][indexB][0];
                    }
                }
            }
        }
        
    }

    private lerp (start: number, end: number, weight: number){
        return (1-weight)*start+weight*end;
    }

}



