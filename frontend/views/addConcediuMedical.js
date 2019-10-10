import { ConcediuMedical } from "../models/ConcediuMedical.js";
import { renderSelectPersonElement, renderSelectChildElement, 
        renderSelectCodIndemnizatieElement, renderSelectCodContractElement} 
        from "../ownModules/selectElement.js";
import { promptInfoMessage } from "../ownModules/infoMessage.js";
import { checkMandatoryFields } from "../ownModules/checkMandatoryFields.js";
import { renderPageHeader, renderMenuTree } from "../ownModules/pageHeader.js";

document.addEventListener('DOMContentLoaded', onHtmlLoaded);

function onHtmlLoaded() {

    renderPageHeader();
    renderMenuTree();

    var selectElement = document.getElementById("beneficiar");
    renderSelectPersonElement(selectElement);

    var selectElement = document.getElementById("contract");
    renderSelectCodContractElement(selectElement);

    var selectElement = document.getElementById("copil");
    renderSelectChildElement(selectElement);

    var selectElement = document.getElementById("codIndemnizatie");
    renderSelectCodIndemnizatieElement(selectElement);

    document.getElementById("sendButton").addEventListener("click", () => {
        var parentElement = document.getElementById("formContainer");
        if (checkMandatoryFields(parentElement)) {
            const inputFields = parentElement.querySelectorAll("input, select");
            var formDataObj = {};
            inputFields.forEach(element => {
                formDataObj[element.name] = element.value;
            })

            handleAddConcediuMedicalClick(formDataObj);
        }
        else {
            promptInfoMessage("Completati toate campurile obligatorii marcate cu rosu");
        }
    });

    const handleAddConcediuMedicalClick = (formDataObj) => {

        var concediuMedical = new ConcediuMedical(formDataObj);
        const root = window.localStorage.getItem("root");
        const apiUrl = root + '/postConcediuMedicalNou';
        concediuMedical.addConcediuMedical(apiUrl)
            .then(response => {
                if (response.ok) {
                    response.json()
                    .then(bodyData => promptInfoMessage(bodyData.message));
                }    
                else {
                    response.json()
                    .then(bodyData => {
                        if (bodyData.code === 'ER_DUP_ENTRY') {
                            promptInfoMessage("Concediu Madical cu acesta SERIE si NUMAR exista deja in sistem")
                        } else {
                            promptInfoMessage("Adaugarea concediului medical NU s-a efectuat. Eroare la server!")
                        }
                    })
                }
            },
                () =>  promptInfoMessage("Adaugarea concediului medical NU s-a efectuat. Eroare de retea sau server!")            
            );
    }


} // end of onHtmlLoaded