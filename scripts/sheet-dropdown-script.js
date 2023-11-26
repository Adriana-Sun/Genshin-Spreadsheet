class dropdownOption{       //parent class w/ getter and construction
    constructor(name, imageName){
        this.name = name;
        this.imageName = imageName;
    }

    get name(){
        return this.name;
    }

    get imageName(){
        return this.imageName;
    }
}

let characterList = {};
let characterImageList = {};