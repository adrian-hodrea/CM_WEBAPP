import { renderSelectPersonElement } from "./selectElement.js";
import { Persoana } from "../models/Persoana.js";
import { promptInfoMessage, promptConfirmationMessage } from "./infoMessage.js";


document.addEventListener('DOMContentLoaded', onHtmlLoaded);

function onHtmlLoaded() {
    var selectElement = document.getElementById("tataCopil");
    renderSelectPersonElement(selectElement);

    var selectElement = document.getElementById("mamaCopil");
    renderSelectPersonElement(selectElement);


} // end of onHtmlLoaded