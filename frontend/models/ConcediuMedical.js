class ConcediuMedical {
    constructor (concediu) {
        this.serieCM = concediu.serieCM,
        this.numarCM = concediu.numarCM,
        this.persFk = concediu.persFk,
        this.dataAcordarii = concediu.dataAcordarii,
        this.deLaData = concediu.deLaData,
        this.laData = concediu.laData,
        this.tipInicCont = concediu.tinInitCont,
        this.codIndemnicatieFk = concediu.codIndemnizatieFk
        this.cmInitFk =  concediu.cmInitFk,
        this.copilFk = concediu.copilFk
    };

    addConcediuMedical = (apiUrl) => {
        const self = this;
       return  fetch(apiUrl,{
            method : "POST",
            headers: {"Content-Type": "application/json"},   
            body: JSON.stringify(self)
        });
    };

    stergeConcediuMedical = (apiUrl) => {
        const self = this;
       return  fetch(apiUrl,{
            method : "DELETE",
            headers: {"Content-Type": "application/json"},   
            body: JSON.stringify(self)
        });
    };

    modificaConcediuMedical = (apiUrl) => {
        const self = this;
       return  fetch(apiUrl,{
            method : "PUT",
            headers: {"Content-Type": "application/json"},   
            body: JSON.stringify(self)
        });
    };

}

export { ConcediuMedical };