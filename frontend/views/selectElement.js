import { IdDocTypes } from "../models/IdDocTypes.js";

const renderSelectElement = (element) => {
    var idDocTypes = new IdDocTypes();
    const root = window.localStorage.getItem("root");
    const apiUrl = root + "/getIdDocTypes";
    idDocTypes.getIdDocTypesList(apiUrl).then( () => {
        var selectOptions = ``;
        idDocTypes.items.forEach( (element,index) => {
            selectOptions += `<option value="${element.codCI}">${element.desCI}</option>` 
        }); 
        element.innerHTML = selectOptions;
    });
};

export { renderSelectElement }; 