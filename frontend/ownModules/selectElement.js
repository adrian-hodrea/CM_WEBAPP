import { IdDocTypes } from "../models/IdDocTypes.js";
import { PersonsList } from "../models/PersonsList.js";
import { ChildrenList } from "../models/ChildrenList.js";
import { CodIndemnizatiiList } from "../models/CodIndemnizatiiList.js";
import { ContracteList } from "../models/ContracteList.js";
import { ConcediiMedicaleList } from "../models/ConcediiMedicaleList.js";



const renderSelectTipDocIdentitElement = (element,defaultCodCi) => {
    var idDocTypes = new IdDocTypes();
    const root = window.localStorage.getItem("root");
    const apiUrl = root + "/getIdDocTypes";
    idDocTypes.getIdDocTypesList(apiUrl).then( () => {
        var selectOptions = `<option value=""></option>`;
        idDocTypes.items.forEach( (element) => {
            if (element.ci_id == defaultCodCi) {
                selectOptions += `<option value="${element.ci_id}" selected>${element.descriere_ci}</option>`;
            }
             else {
                selectOptions += `<option value="${element.ci_id}">${element.descriere_ci}</option>`;
             }   
        }); 
        element.innerHTML = selectOptions;
    });
};

const renderSelectCodIndemnizatieElement = (element,defaultCodIndemnizatie) => {
    var coduriIndemnizatie = new CodIndemnizatiiList();
    const root = window.localStorage.getItem("root");
    const apiUrl = root + "/getCodIndemnizatiiList";
    coduriIndemnizatie.getCodIndemnizatiiList(apiUrl).then( () => {
        var selectOptions = `<option value=""></option>`;
        coduriIndemnizatie.items.forEach( (element) => {
            if (element.cod_id == defaultCodIndemnizatie) {
                selectOptions += `<option value="${element.cod_id}" selected>${element.cod_indemnizatie} ${element.descriere_indemnizatie}</option>`;
            }
             else {
                selectOptions += `<option value="${element.cod_id}">${element.cod_indemnizatie} ${element.descriere_indemnizatie}</option>`;
             }   
        }); 
        element.innerHTML = selectOptions;
    });
};

const renderSelectPersonElement = (element,defaultPers) => {
    const  listaPersoane = new PersonsList();
    const root = window.localStorage.getItem("root");
    const apiUrl = root + '/getPersons';
    listaPersoane.getPersonsList(apiUrl).then( () => {
        var selectOptions = `<option value=""></option>`;
        listaPersoane.items.forEach( (element) => {
            if (element.pers == defaultPers) {
                selectOptions += `<option value="${element.pers}" selected>${element.nume} ${element.prenume}</option>`;
            } 
            else { 
                selectOptions += `<option value="${element.pers}">${element.nume} ${element.prenume}</option>`;  
            }
        });
        element.innerHTML = selectOptions;
    });
}; 

const renderSelectChildElement = (element,defaultChild) => {
    const  listaCopii = new ChildrenList();
    const root = window.localStorage.getItem("root");
    const apiUrl = root + '/getChildren';
    listaCopii.getChildrenList(apiUrl).then( () => {
        var selectOptions = `<option value=''></option>`;
        listaCopii.items.forEach( (item) => {
            if (item.copil == defaultChild) {
                selectOptions += `<option value="${item.copil}" selected>${item.nume} ${item.prenume}</option>`;
            } 
            else { 
                selectOptions += `<option value="${item.copil}">${item.nume} ${item.prenume}</option>`;  
            }
        });
        element.innerHTML = selectOptions;
    });
}; 

const renderSelectCodContractElement = (element,defaultCodContract) => {
    var coduriContracte = new ContracteList();
    const root = window.localStorage.getItem("root");
    const apiUrl = root + "/getContracteList";
    coduriContracte.getContracteList(apiUrl).then( () => {
        var selectOptions = `<option value=""></option>`;
        coduriContracte.items.forEach( (item) => {
            if (item.idctr == defaultCodContract) {
                selectOptions += `<option value="${item.idctr}" selected>${item.nrCtr} / ${item.dataInceput}</option>`;
            }
             else {
                selectOptions += `<option value="${item.idctr}">${item.nrCtr} / ${item.dataInceput}</option>`;
             }   
        }); 
        element.innerHTML = selectOptions;
    });
};


const renderSelectCodCmInitialElement = (element,defaultCodCm) => {
    var coduriCM = new ConcediiMedicaleList();
    const root = window.localStorage.getItem("root");
    const apiUrl = root + "/getConcediiMedicaleList";
    coduriCM.getConcediiMedicaleList(apiUrl).then( () => {
        var selectOptions = `<option value=""></option>`;
        coduriCM.items.forEach( (item) => {
            if (item.cm == defaultCodCm) {
                selectOptions += `<option value="${item.cm}" selected>${item.serie_cm} / ${item.numar_cm}</option>`;
            }
             else {
                selectOptions += `<option value="${item.cm}">${item.serie_cm} ${item.numar_cm}</option>`;
             }   
        }); 
        element.innerHTML = selectOptions;
    });
};



export { renderSelectTipDocIdentitElement, renderSelectPersonElement, 
         renderSelectChildElement, renderSelectCodIndemnizatieElement, 
         renderSelectCodContractElement, renderSelectCodCmInitialElement }; 