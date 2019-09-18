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
        tr.setAttribute("data-editMode","false");
        tr.innerHTML = `
            <td>${index+1}</td>
            <td><p data-propName="nume"    class="editableTableCell">${persoana.nume}</p></td>
            <td><p data-propName="prenume" class="editableTableCell">${persoana.prenume}</p></td>
            <td><p data-propName="cnp" class="editableTableCell">${persoana.cnp}</p></td>
            <td>-</td>
            <td><p data-propName="seriaCI" class="editableTableCell">${persoana.seriaCI}</p></td>
            <td><p data-propName="numarCI" class="editableTableCell">${persoana.numarCI}</p></td>
            <td><p data-propName="eliberatDeCI" class="editableTableCell">${persoana.eliberatDeCI}</p></td>
            <td><p data-propName="dataEliberariiCI" class="editableTableCell">${persoana.dataEliberariiCI}</p></td>
            <td><p data-propName="localitatea" class="editableTableCell">${persoana.localitatea}</p></td>
            <td><p data-propName="strada" class="editableTableCell">${persoana.strada}</p></td>
            <td><p data-propName="nrStrada" class="editableTableCell">${persoana.nrStrada}</p></td>
            <td><p data-propName="bloc" class="editableTableCell">${persoana.bloc}</p></td>
            <td><p data-propName="scara" class="editableTableCell">${persoana.scara}</p></td>
            <td><p data-propName="nrApartament" class="editableTableCell">${persoana.nrApartament}</p></td>
            <td><p data-propName="judet" class="editableTableCell">${persoana.judet}</p></td>
            <td><p data-propName="sector" class="editableTableCell">${persoana.sector}</p></td>
            <td><p data-propName="telefon" class="editableTableCell">${persoana.telefon}</p></td>
            <td>
                <span title="Editeaza" id="editPersonBtn">
                    <i class="fas fa-pen"></i>
                    <span>Edit</span>
                </span>
                <span title="Sterge" id="deletePersonBtn">
                    <i class="fas fa-trash-alt"></i>  
                    <span>Delete</span>
                </span>
                <span title="Save" id="saveChangesBtn">
                    <span>Save</span>
                </span>
            </td>             
            `; 
        var editButton =   tr.querySelector("#editPersonBtn");
        var deleteButton = tr.querySelector("#deletePersonBtn");
        var saveButton =   tr.querySelector("#saveChangesBtn");
        let actualHtmlData = {};
        let newHtmlDataObj = {};

        saveButton.style.visibility = "hidden";

        editButton.addEventListener("click", handleEditPerson(tr,editButton,saveButton));
        deleteButton.addEventListener("click", handleDeletePerson(persoana,tr));
        saveButton.addEventListener("click", handleSavePerson(tr,saveButton,actualHtmlData));


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

        function handleEditPerson(tr,editButton,saveButton) {
            return () => {
                const editMode = tr.getAttribute("data-editMode");
                var editableCells = Array.from(tr.getElementsByClassName("editableTableCell"));
                if (editMode === 'false') {
                    saveActualHtmlData(editableCells,actualHtmlData);
                    tr.setAttribute("data-editMode","true");
                    editButton.lastElementChild.innerHTML="Cancel";
                    editButton.firstElementChild.style.display = "none";
                    editableCells.forEach(element => {
                        element.setAttribute("contenteditable","true");
                    });
                    tr.classList.add("editableTableRow");
                    saveButton.style.visibility = "visible";   
                }
                else {
                    tr.setAttribute("data-editMode","false");
                    restoreDataBeforeEdit(editableCells,actualHtmlData);
                    editButton.lastElementChild.innerHTML="Edit";
                    editButton.firstElementChild.style.display = "inline";
                    editableCells.forEach(element => {
                        element.removeAttribute("contenteditable");
                    });
                    tr.classList.remove("editableTableRow");
                    saveButton.style.visibility = "hidden";   
                }
            }
        } // end of handleEditPerson

        function handleSavePerson(tr) {
            return ()=> {
                var editableCells = Array.from(tr.getElementsByClassName("editableTableCell"));
                saveActualHtmlData(editableCells,newHtmlDataObj);
                const person = new Persoana(newHtmlDataObj);
                const apiUrl = root + '/editPerson';
                person.modificaPersoanaInBD(apiUrl)
                .then(response => response.json()
                    .then(bodyData => {
                        tr.setAttribute("data-editMode","false");
                        editButton.lastElementChild.innerHTML="Edit";
                        editButton.firstElementChild.style.display = "inline";    
                        editableCells.forEach(element => {
                            element.removeAttribute("contenteditable");
                        });
                        tr.classList.remove("editableTableRow");
                        saveButton.style.visibility = "hidden";       
                        /* setTimeout(() => {
                            promptInfoMessage(bodyData.message);
                        }, 300);    */                              
                    })  
                )
            }
        }

        function saveActualHtmlData(editableCells,objToPopulate) {
            editableCells.forEach(element => {
                var propName = element.getAttribute("data-propName");
                objToPopulate[propName] = element.innerText;
            }); 
        }

        function restoreDataBeforeEdit(editableCells,objToReadFrom) {
            editableCells.forEach(element => {
                var propName = element.getAttribute("data-propName");
                var textToRestore = objToReadFrom[propName];
                element.innerText = textToRestore;
            });
        };    

        personsContainer.appendChild(tr);    

    }); // end of foreach
}

