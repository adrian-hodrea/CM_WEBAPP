
class Persoana {
    constructor (personData) {
        this.refreshData(personData);
    } 

    refreshData (personData) {
        this.nume = personData.nume;
        this.prenume = personData.prenume;
        this.cnp = personData.cnp;

        this.desCI = personData.descriere_ci;
        this.seriaCI = personData.seriaCI;
        this.numarCI = personData.numarCI;
        this.eliberatDeCI = personData.eliberatDeCI;
        this.dataEliberariiCI = personData.dataEliberariiCI;

        this.localitatea = personData.localitatea;
        this.strada = personData.strada;
        this.nrStrada = personData.nrStrada;
        this.bloc = personData.bloc;
        this.scara = personData.scara;
        this.nrApartament = personData.nrApartament;
        this.judet = personData.judet;
        this.sector = personData.sector;
  
        this.telefon = personData.telefon;
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

export { Persoana };