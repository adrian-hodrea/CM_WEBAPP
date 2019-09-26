import { renderSelectElement } from "./selectElement.js";

document.addEventListener('DOMContentLoaded', onHtmlLoaded);
function onHtmlLoaded() {
    var selectElement = document.getElementById("IdDocTypes");
    renderSelectElement(selectElement);

    document.getElementById("sendButton").addEventListener("click", () => {
        if (checkMandatoryFields()) {
            const inputFields = document.querySelectorAll("input, select");
            var formDataObj = {};
            inputFields.forEach(element => {
                formDataObj[element.name] = element.value;
            })

            handleAddPersonClick(formDataObj);
        }
        else {
            promptInfoMessage("Completati toate campurile obligatorii marcate cu rosu");
        }
    })
   
    const checkMandatoryFields = () => {
        const requiredFields = document.querySelectorAll("input[required], select[required]");
        var allRequiredFieldsOK = true;
        requiredFields.forEach( (item)=> {
            if (item.value === "") {
                allRequiredFieldsOK = false;
                item.classList.add("mandatoryField");
            }
            else {
                item.style.border = "none";
            }
        })
        return allRequiredFieldsOK;
    }

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

