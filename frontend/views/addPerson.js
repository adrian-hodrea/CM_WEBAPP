import { renderSelectTipDocIdentitElement } from "../ownModules/selectElement.js";
import { Persoana } from "../models/Persoana.js";
import { promptInfoMessage} from "../ownModules/infoMessage.js";
import { checkMandatoryFields} from "../ownModules/checkMandatoryFields.js";
import { renderPageHeader,renderMenuTree } from "../ownModules/pageHeader.js";


document.addEventListener('DOMContentLoaded', onHtmlLoaded);
function onHtmlLoaded() {
    renderPageHeader();
    renderMenuTree();

    var selectElement = document.getElementById("IdDocTypes");
    renderSelectTipDocIdentitElement(selectElement);

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

        var persoanaNoua = new Persoana(formDataObj);
        const root = window.localStorage.getItem("root");
        const apiUrl = root + '/postPersoanaNoua';
        persoanaNoua.adaugaPersoanaInBD(apiUrl)
            .then(response => {
                if (response.ok) {
                    response.json().then(bodyData => promptInfoMessage(bodyData.message));
                }    
                else {
                    response.json()
                    .then(bodyData => {
                        if (bodyData.code === 'ER_DUP_ENTRY') {
                            promptInfoMessage("Persoana cu acest CNP exista deja in sistem")
                        } else {
                            promptInfoMessage("Adaugarea persoanei NU s-a efectuat. Eroare la server!")
                        }
                    })
                }
            })
    }

} // End of onHtmlLoad

