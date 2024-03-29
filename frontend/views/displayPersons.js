import { renderPageHeader,renderMenuTree } from "../ownModules/pageHeader.js";
import { renderSelectTipDocIdentitElement } from "../ownModules/selectElement.js";
import { saveActualHtmlData } from "../ownModules/saveActualHtmlData.js";
import { restoreDataBeforeEdit } from "../ownModules/restoreDataBeforeEdit.js";
import { PersonsList } from "../models/PersonsList.js";
import { Persoana } from "../models/Persoana.js";
import { promptInfoMessage, promptConfirmationMessage } from "../ownModules/infoMessage.js";
import { createDisplayTableRow } from "../ownModules/createDisplayTableRow.js";
import { handler } from "../ownModules/bindToViewProxyHandler.js";


document.addEventListener('DOMContentLoaded', onHtmlLoaded);

function onHtmlLoaded() {
var persons = [];

renderPageHeader();
renderMenuTree();
    
const root = window.localStorage.getItem("root");
const  listaPersoane = new PersonsList();
const apiUrl = root + '/getPersons';
listaPersoane.getPersonsList(apiUrl)
.then( () => appendPersons(listaPersoane.items));

const appendPersons = listOfPersons => {
    const personsContainer = document.getElementById("personsContainerBody");

    listOfPersons.forEach( (element, index) => {
        var person = new Persoana(element);
        var tr = createDisplayTableRow(person, index);
        var person = new Proxy(person,handler);
        persons.push(person);
        person.refreshData(element); 
        

        var editButton =   tr.querySelector("#editBtn");
        var deleteButton = tr.querySelector("#deleteBtn");
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
            var message = `Sunteti sigur ca doriti sa stergeti persoana ${person.nume} ${person.prenume} ?`;
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

                    renderSelectTipDocIdentitElement(selectElement,persoana.codCI);
                    selectElement.style.display = "block";
                }
                else {
                    tr.setAttribute("data-editMode","false");
                    restoreDataBeforeEdit(editableCells,actualHtmlData);  // put back data into html row from saved data
                    removeRowEditUX(editableCells);
                }
        } 

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
                        persoana.codCI = idDocIdentit;
                        var tipDocIdentit = selectElement.querySelector(`option[value="${idDocIdentit}"]`).innerText;
                        pDesDocIdentit.innerHTML = tipDocIdentit;
                        removeRowEditUX(editableCells);
                } 
                else {

                }
            })
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
}; // end of appendPersons

}; // end of onHtmlLoaded


