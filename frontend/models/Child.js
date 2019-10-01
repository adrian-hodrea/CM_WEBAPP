class Child {
    constructor (child) {
        this.nume = child.nume;
        this.prenume = child.prenume;
        this.cnp = child.cnp;
        this.seriaCN = child.seriaCN;
        this.numarCN = child.numarCN;
        this.dataNasterii = child.dataNasterii;
        this.tataFk = child.tataFk;
        this.mamaFk = child.mamaFk;
    }

    adaugaCopilInBD (apiUrl) {
        const self = this;
        return fetch(apiUrl, {
            method: "POST",
            headers: {"Content-Type": "application/json"},   
            body: JSON.stringify(self)
        });
    };

    stergeCopilDinBD (apiUrl) {
        const self = this;
        return fetch (apiUrl, {
            method: "DELETE",
            headers: {"Content-Type": "application/json"}, 
            body: JSON.stringify(self)  
        })
    }

    modificaCopilInBD (apiUrl) {
        const self = this;
        return fetch(apiUrl, {
            method: "PUT",
            headers: {"Content-Type": "application/json"}, 
            body: JSON.stringify(self)  
        })
    }


};

export { Child };