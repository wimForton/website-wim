export class KeyFrame{
    public position: number = 0;
    public value: number = 0;
}

export class Connection{
    public start: number[] = [0,0];
    public end: number[] = [0,0];
}

export class KeyframeList{

    public keyframes: KeyFrame[] = [];
    public connections: Connection[] = [];

    constructor() {

        this.AddKeyframe(0.2, 0.35);
        this.AddKeyframe(0.4, 0.21);
        this.AddKeyframe(0.65, 0.1);
        this.AddKeyframe(0.9, 0.8);
        //this.RemoveKeyframe(0.65);

        console.log("this.keyframes",this.keyframes);


    }
    public AddKeyframe(pos: number, val: number){
        this.keyframes.push({position: pos, value: val});

        //sort by position
        function compareFunction(a:KeyFrame,b:KeyFrame){
            if(a.position > b.position)
            return 1;
            else
            return -1;
        }
        this.keyframes.sort(compareFunction);

        //remove duplicates
        const key = 'position';
        this.keyframes = [...new Map( this.keyframes.map(item =>
        [item[key], item])).values()];
        this.CreateConnections();

    }
    public RemoveKeyframe(pos: number){
        //var obj = this.keyframes.find((obj) => obj.position === pos);
        var index = this.keyframes.findIndex((obj) => obj.position === pos);
        this.keyframes.splice(index, 1);
        this.CreateConnections();
    }
    private CreateConnections(){
        this.connections = [];
        for (let index = 0; index < this.keyframes.length - 1; index++) {
            const connection = new Connection();
            connection.start = [this.keyframes[index].position, this.keyframes[index].value];
            connection.end = [this.keyframes[index + 1].position, this.keyframes[index + 1].value];
            this.connections.push(connection);
        }
    }

}