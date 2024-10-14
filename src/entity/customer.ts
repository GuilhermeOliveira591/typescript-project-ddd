import Address from "./address";

class Customer{

    _id: string;
    _name: string = "";
    _address!: Address;
    // nomeVariavel! -> quer dizer que vai inicializar em branco
    _active: boolean = true;

    constructor(id:string, name:string) {
        this._id = id;
        this._name = name;
        this.validate();
    }

    validate() {
        if(this._name.length === 0){
            throw new Error("Name is required!");
        }

        if(this._id.length === 0){
            throw new Error("Id is required!");
        }
    }

    changeName(name: string) {
        this._name = name;
        this.validate();
    }

    activate() {
        if (this._address === undefined) {
            throw new Error("Address is mandatory to activate a costumer");
        }
        
        this._active = true;
    }

    deactivate() {
        this._active = false;
    }


}

// let Customer = new  Customer(); 