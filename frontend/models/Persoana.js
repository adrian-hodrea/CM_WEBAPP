
class Persoana {
    constructor (pers) {
        this.nume = pers.nume;
        this.prenume = pers.prenume;
        this.cnp = pers.cnp;

        this.codCI = pers.codCI;
        //this.desCI = pers.desCI;
        this.seriaCI = pers.seriaCI;
        this.numarCI = pers.numarCI;
        this.eliberatDeCI = pers.eliberatDeCI;
        this.dataEliberariiCI = pers.dataEliberariiCI;

        this.localitatea = pers.localitatea;
        this.strada = pers.strada;
        this.nrStrada = pers.nrStrada;
        this.bloc = pers.bloc;
        this.scara = pers.scara;
        this.nrApartament = pers.nrApartament;
        this.judet = pers.judet;
        this.sector = pers.sector;
  
        this.telefon = pers.telefon;
    }  

    adaugaPersoanaInBD (apiUrl) {
        const self = this;
        return fetch(apiUrl, {
            method: "POST",
            headers: {"Content-Type": "application/json"},   
            body: JSON.stringify(self)
         })
    }

    stergePersoanaDinBD (apiUrl) {
        const self = this;
        return fetch (apiUrl, {
            method: "DELETE",
            headers: {"Content-Type": "application/json"}, 
            body: JSON.stringify(self)  
        })
    }

    modificaPersoanaInBD (apiUrl) {
        const self = this;
        return fetch(apiUrl, {
            method: "PUT",
            headers: {"Content-Type": "application/json"}, 
            body: JSON.stringify(self)  
        })
    }

}

