import { Child } from "../models/Child.js";
import { renderSelectPersonElement } from "../ownModules/selectElement.js";
import { promptInfoMessage } from "../ownModules/infoMessage.js";
import { checkMandatoryFields } from "../ownModules/checkMandatoryFields.js";
import { renderPageHeader,renderMenuTree } from "../ownModules/pageHeader.js";

document.addEventListener('DOMContentLoaded', onHtmlLoaded);

function onHtmlLoaded() {

    renderPageHeader();
    renderMenuTree();

    var selectElement = document.getElementById("tataCopil");
    renderSelectPersonElement(selectElement);

    var selectElement = document.getElementById("mamaCopil");
    renderSelectPersonElement(selectElement);

    document.getElementById("sendButton").addEventListener("click", () => {
        var parentElement = document.getElementById("formContainer");
        if (checkMandatoryFields(parentElement)) {
            const inputFields = parentElement.querySelectorAll("input, select");
            var formDataObj = {};
            inputFields.forEach(element => {
                formDataObj[element.name] = element.value;
            })

            handleAddPersonClick(formDataObj);
        }
        else {
            promptInfoMessage("Completati toate campurile obligatorii marcate cu rosu");
        }
    });

    const handleAddPersonClick = (formDataObj) => {

        var child = new Child(formDataObj);
        const root = window.localStorage.getItem("root");
        const apiUrl = root + '/postCopilNou';
        child.adaugaCopilInBD(apiUrl)
            .then(response => {
                if (response.ok) {
                    response.json()
                    .then(bodyData => promptInfoMessage(bodyData.message));
                }    
                else {
                    response.json()
                    .then(bodyData => {
                        if (bodyData.code === 'ER_DUP_ENTRY') {
                            promptInfoMessage("Copilul cu acest CNP exista deja in sistem")
                        } else {
                            promptInfoMessage("Adaugarea copilului NU s-a efectuat. Eroare la server!")
                        }
                    })
                }
            },
                () =>  promptInfoMessage("Adaugarea copilului NU s-a efectuat. Eroare de retea sau server!")            
            );
    }


} // end of onHtmlLoaded