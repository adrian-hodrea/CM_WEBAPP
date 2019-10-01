import { IdDocTypes } from "../models/IdDocTypes.js";
import { PersonsList } from "../models/PersonsList.js";

const renderSelectTipDocIdentitElement = (element) => {
    var idDocTypes = new IdDocTypes();
    const root = window.localStorage.getItem("root");
    const apiUrl = root + "/getIdDocTypes";
    idDocTypes.getIdDocTypesList(apiUrl).then( () => {
        var selectOptions = ``;
        idDocTypes.items.forEach( (element) => {
            selectOptions += `<option value="${element.codCI}">${element.desCI}</option>`;
        }); 
        element.innerHTML = selectOptions;
    });
};


const renderSelectPersonElement = (element) => {
    const  listaPersoane = new PersonsList();
    const root = window.localStorage.getItem("root");
    const apiUrl = root + '/getPersons';
    listaPersoane.getPersonsList(apiUrl).then( () => {
        var selectOptions = ``;
        listaPersoane.items.forEach( (element) => {
            selectOptions += `<option value="${element.pers}">${element.nume} ${element.prenume}</option>`;
        });
        element.innerHTML = selectOptions;
    });
}; 

export { renderSelectTipDocIdentitElement, renderSelectPersonElement }; 