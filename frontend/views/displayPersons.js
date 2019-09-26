import { renderSelectTipDocIdentitElement } from "./selectElement.js";
import { PersonsList } from "../models/PersonsList.js";
import { Persoana } from "../models/Persoana.js";
import { promptInfoMessage, promptConfirmationMessage } from "./infoMessage.js";

const root = window.localStorage.getItem("root");
const  listaPersoane = new PersonsList();
const apiUrl = root + '/getPersons';
listaPersoane.getPersonsList(apiUrl)
.then( () => appendPersons(listaPersoane.items));

const appendPersons = (listOfPersons) => {
    const personsContainer = document.getElementById("personsContainerBody");

    listOfPersons.forEach( (element, index) => {
        var persoana = new Persoana(element);
        var tr = document.createElement("tr");
        var {nume, prenume, cnp, desCI, seriaCI, numarCI, eliberatDeCI, dataEliberariiCI,
            localitatea, strada, nrStrada, bloc, scara, nrApartament, judet, sector, telefon} = element;
        tr.setAttribute("data-editMode","false");
        tr.innerHTML = `
            <td>${index+1}</td>
            <td><p data-propName="nume" class="editableTableCell">${nume}</p></td>
            <td><p data-propName="prenume" class="editableTableCell">${prenume}</p></td>
            <td><p data-propName="cnp" class="editableTableCell">${cnp}</p></td>
            <td>
                <p id="desCI">${desCI}</p>
                <select data-propName="codCI" name="codCI" style="display: none" class="editableTableCell"></select>
            </td>
            <td><p data-propName="seriaCI" class="editableTableCell">${seriaCI}</p></td>
            <td><p data-propName="numarCI" class="editableTableCell">${numarCI}</p></td>
            <td><p data-propName="eliberatDeCI" class="editableTableCell">${eliberatDeCI}</p></td>
            <td><p data-propName="dataEliberariiCI" class="editableTableCell">${dataEliberariiCI}</p></td>
            <td><p data-propName="localitatea" class="editableTableCell">${localitatea}</p></td>
            <td><p data-propName="strada" class="editableTableCell">${strada}</p></td>
            <td><p data-propName="nrStrada" class="editableTableCell">${nrStrada}</p></td>
            <td><p data-propName="bloc" class="editableTableCell">${bloc}</p></td>
            <td><p data-propName="scara" class="editableTableCell">${scara}</p></td>
            <td><p data-propName="nrApartament" class="editableTableCell">${nrApartament}</p></td>
            <td><p data-propName="judet" class="editableTableCell">${judet}</p></td>
            <td><p data-propName="sector" class="editableTableCell">${sector}</p></td>
            <td><p data-propName="telefon" class="editableTableCell">${telefon}</p></td>
            <td>
                <span title="Editeaza" id="editPersonBtn" class="editRowBtn">
                    <i class="fas fa-pen"></i>
                    <span>Edit</span>
                </span>
                <span title="Sterge" id="deletePersonBtn" class="deleteRowBtn">
                    <i class="fas fa-trash-alt"></i>  
                    <span>Delete</span>
                </span>
                <span title="Save" id="saveChangesBtn" class="saveChangesBtn">
                    <span>Save</span>
                </span>
            </td>             
            `; 
        var editButton =   tr.querySelector("#editPersonBtn");
        var deleteButton = tr.querySelector("#deletePersonBtn");
        var saveButton =   tr.querySelector("#saveChangesBtn");
        var actualHtmlData = {};
        var newHtmlDataObj = {};
        var selectElement = tr.querySelector("select");
        var pDesDocIdentit = tr.querySelector('[id="desCI"]');

        saveButton.style.visibility = "hidden";

        editButton.addEventListener("click", handleEditPersonButtonClick);
        deleteButton.addEventListener("click", handleDeletePersonButtonClick);
        saveButton.addEventListener("click", handleSavePersonButtonClick);


        function handleDeletePersonButtonClick() {
            tr.classList.add("mandatoryField");
            var message = `Sunteti sigur ca doriti sa stergeti persoana ${nume} ${prenume} ?`;
            const handlePersonDeleteConfirmation = () => {
                return  () => {
                    document.getElementById("OpenModal").remove();
                    const apiUrl = root + '/deletePerson';
                    persoana.stergePersoanaDinBD(apiUrl)
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
            const handlePersonDeleteCancelation = () => {
                return () => tr.classList.remove("mandatoryField");
            }
            promptConfirmationMessage(message, handlePersonDeleteConfirmation(), handlePersonDeleteCancelation()); 
        }; 

        function handleEditPersonButtonClick() {
                const editMode = tr.getAttribute("data-editMode");
                var editableCells = Array.from(tr.getElementsByClassName("editableTableCell"));
                if (editMode === 'false') { // Click pe Edit version of Button
                    saveActualHtmlData(editableCells,actualHtmlData); // Save row displayed data before row Edit to put back in case of Cancelation of Edit action
                    tr.setAttribute("data-editMode","true");
                    editButton.lastElementChild.innerHTML="Cancel";
                    editButton.classList.add("cancelEditRowBtn");
                    editButton.firstElementChild.style.display = "none";
                    editableCells.forEach(element => {
                        element.setAttribute("contenteditable","true");
                    });
                    tr.classList.add("editableTableRow");
                    saveButton.style.visibility = "visible";  
                    tr.querySelector("p[id='desCI']").style.display = "none";

                    renderSelectTipDocIdentitElement(selectElement);
                    selectElement.style.display = "block";
                }
                else {
                    tr.setAttribute("data-editMode","false");
                    restoreDataBeforeEdit(editableCells,actualHtmlData);  // put back data into html row from saved data
                    removeRowEditUX(editableCells);
                }
        } // end of handleEditPerson

        function handleSavePersonButtonClick() {
            var editableCells = Array.from(tr.getElementsByClassName("editableTableCell"));
            saveActualHtmlData(editableCells,newHtmlDataObj);
            const person = new Persoana(newHtmlDataObj);
            const apiUrl = root + '/editPerson';
            person.modificaPersoanaInBD(apiUrl)
            .then(response => {
                if (response.ok) {   // raspunsul venit de la server e cu status de 200
                        tr.setAttribute("data-editMode","false");
                        var idDocIdentit = selectElement.value;
                        var tipDocIdentit = selectElement.querySelector(`option[value="${idDocIdentit}"]`).innerText;
                        pDesDocIdentit.innerHTML = tipDocIdentit;
                        removeRowEditUX(editableCells);
                } 
                else {

                }
            })
        }

        function saveActualHtmlData(editableCells,objToPopulate) {
            editableCells.forEach(element => {
                var propName = element.getAttribute("data-propName");
                var elementType = element.tagName;
                if (elementType === "P")
                    objToPopulate[propName] = element.innerText;
                else
                    objToPopulate[propName] = element.value;
            }); 
        }

        function restoreDataBeforeEdit(editableCells,objToReadFrom) {
            editableCells.forEach(element => {
                var propName = element.getAttribute("data-propName");
                var textToRestore = objToReadFrom[propName];
                element.innerText = textToRestore;
            });
        };    

        function removeRowEditUX (editableCells) {
            editButton.lastElementChild.innerHTML="Edit";
            editButton.classList.remove("cancelEditRowBtn");
            editButton.firstElementChild.style.display = "inline";
            editableCells.forEach(element => element.removeAttribute("contenteditable"));
            tr.classList.remove("editableTableRow");
            saveButton.style.visibility = "hidden"; 
            tr.querySelector("p[id='desCI']").style.display = "block";
            selectElement.style.display = "none";
        }

        personsContainer.appendChild(tr);    

    }); // end of foreach
}

