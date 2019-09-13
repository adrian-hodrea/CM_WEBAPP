const root = "http://127.0.0.1:3000";
const  listaPersoane = new PersonsList();
const apiUrl = root + '/getPersons';
listaPersoane.getPersonsList(apiUrl)
.then( () => appendPersons(listaPersoane.items));

const appendPersons = (listOfPersons) => {
    const personsContainer = document.getElementById("personsContainerBody");
    listOfPersons.forEach( (element, index) => {
        var persoana = new Persoana(element);
        var tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${index+1}</td>
            <td>${persoana.nume}</td>
            <td>${persoana.prenume}</td>
            <td>${persoana.cnp}</td>
            <td>-</td>
            <td>${persoana.seriaCI}</td>
            <td>${persoana.numarCI}</td>
            <td>${persoana.eliberatDeCI}</td>
            <td>${persoana.dataEliberariiCI}</td>
            <td>${persoana.localitatea}</td>
            <td>${persoana.strada}</td>
            <td>${persoana.nrStrada}</td>
            <td>${persoana.bloc}</td>
            <td>${persoana.scara}</td>
            <td>${persoana.nrApartament}</td>
            <td>${persoana.judet}</td>
            <td>${persoana.sector}</td>
            <td>${persoana.telefon}</td>
            <td>
                <i title="Editeaza" class="editPerson fas fa-pen"></i>
                <i title="Sterge" class="deletePerson fas fa-trash-alt"></i>    
            </td>             
            `; 
        var editButton = tr.lastElementChild.firstElementChild;
        editButton.addEventListener("click", handleEditPerson(persoana,tr,editButton));
        tr.lastElementChild.lastElementChild.addEventListener("click", handleDeletePerson(persoana,tr));
       
        function handleDeletePerson(persoana,tr)  {
            return () => {
                tr.classList.add("mandatoryField");
                var {nume, prenume} = persoana;
                var message = `Sunteti sigur ca doriti sa stergeti persoana ${nume} ${prenume} ?`;
                const handlePersonDeleteConfirmation = (persoana,tr) => {
                    return  () => {
                        document.getElementById("OpenModal").remove();
                        const apiUrl = root + '/deletePerson';
                        persoana.adaugaPersoanaInBD(apiUrl)
                        .then(responseObject => responseObject.json()
                            .then(bodyData => {
                                setTimeout(() => {
                                    promptInfoMessage(bodyData.message);
                                    tr.remove();
                                }, 300);                                 
                            })  
                        )
                    }
                }; // end of handlePersonDeleteConfirmation function
                const handlePersonDeleteCancelation = (tr) => {
                    return () => {
                        tr.classList.remove("mandatoryField");
                    }
                }
                promptConfirmationMessage(message, handlePersonDeleteConfirmation(persoana,tr), handlePersonDeleteCancelation(tr)); 
            }

        }; // end of handleDeletePerson

        function handleEditPerson(persoana,tr,editButton) {
            return () => {
                tr.setAttribute("contenteditable","true");
                tr.classList.add("editableTableRow");
                editButton.classList.add("sunkEffect");
            }
        } // end of handleEditPerson



        personsContainer.appendChild(tr);

    }); // end of foreach
}

