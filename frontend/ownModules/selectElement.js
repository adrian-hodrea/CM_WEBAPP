import { IdDocTypes } from "../models/IdDocTypes.js";
import { PersonsList } from "../models/PersonsList.js";

const renderSelectTipDocIdentitElement = (element,defaultCodCi) => {
    var idDocTypes = new IdDocTypes();
    const root = window.localStorage.getItem("root");
    const apiUrl = root + "/getIdDocTypes";
    idDocTypes.getIdDocTypesList(apiUrl).then( () => {
        var selectOptions = `<option value=""></option>`;
        idDocTypes.items.forEach( (element) => {
            if (element.codCI == defaultCodCi) {
                selectOptions += `<option value="${element.codCI}" selected>${element.desCI}</option>`;
            }
             else {
                selectOptions += `<option value="${element.codCI}">${element.desCI}</option>`;
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

export { renderSelectTipDocIdentitElement, renderSelectPersonElement }; 