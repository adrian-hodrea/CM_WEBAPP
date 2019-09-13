document.addEventListener('DOMContentLoaded', onHtmlLoaded);
function onHtmlLoaded() {

    document.getElementById("sendButton").addEventListener("click", () => {
        if (checkMandatoryFields()) {
            const inputFields = document.getElementsByTagName("input");
            handleAddPersonClick(inputFields);
        }
        else {
            promptInfoMessage("Completati toate campurile obligatorii marcate cu rosu");
        }
    })
   
    const checkMandatoryFields = () => {
        const requiredFields = document.querySelectorAll("input[required]");
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

    const handleAddPersonClick = (formData) => {
        var persoanaNoua = new Persoana({
            nume: formData[0].value,
            prenume: formData[1].value,
            cnp: formData[2].value,
    
            seriaCI: formData[3].value,
            numarCI: formData[4].value,
            eliberatDeCI: formData[5].value,
            dataEliberariiCI: formData[6].value,
    
            localitatea: formData[7].value,
            strada: formData[8].value,
            nrStrada: formData[9].value,
            bloc: formData[10].value,
            scara: formData[11].value,
            nrApartament: formData[12].value,
            judet:  formData[13].value,
            sector:formData[14].value,
      
            telefon:formData[15].value
        });
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

