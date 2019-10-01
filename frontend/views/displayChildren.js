import { renderSelectPersonElement } from "../ownModules/selectElement.js";
import { saveActualHtmlData } from "../ownModules/saveActualHtmlData.js";
import { restoreDataBeforeEdit } from "../ownModules/restoreDataBeforeEdit.js";
import { ChildrenList } from "../models/ChildrenList.js";
import { Child } from "../models/Child.js";
import { promptInfoMessage, promptConfirmationMessage } from "../ownModules/infoMessage.js";

const root = window.localStorage.getItem("root");
const  listaCopii = new ChildrenList();
const apiUrl = root + '/getChildren';
listaCopii.getChildrenList(apiUrl)
.then( () => appendChildren(listaCopii.items));

const appendChildren = (listOfChildren) => {
    const childrenContainer = document.getElementById("childrenContainerBody");

    listOfChildren.forEach( (element, index) => {
        var child = new Child(element);
        var tr = document.createElement("tr");
        var {nume, prenume, cnp, seriaCN, numarCN, 
            dataNasterii, numeTata, prenumeTata, numeMama, prenumeMama} = element;
        tr.setAttribute("data-editMode","false");
        tr.innerHTML = `
            <td>${index+1}</td>
            <td><p data-propName="nume" class="editableTableCell">${nume}</p></td>
            <td><p data-propName="prenume" class="editableTableCell">${prenume}</p></td>
            <td><p data-propName="cnp" class="editableTableCell">${cnp}</p></td>
            <td><p data-propName="seriaCN" class="editableTableCell">${seriaCN}</p></td>
            <td><p data-propName="numarCN" class="editableTableCell">${numarCN}</p></td>
            <td><p data-propName="dataNasterii" class="editableTableCell">${dataNasterii}</p></td>
            <td>
                <p id="numeTata">${numeTata} ${prenumeTata}</p>
                <select id="selectNumeTata" data-propName="tataFk" name="tataFK" style="display: none" class="editableTableCell"></select>
            </td>
            <td>
                <p id="numeMama">${numeMama} ${prenumeMama}</p>
                <select id="selectNumeMama" data-propName="mamaFk" name="mamaFK" style="display: none" class="editableTableCell"></select>
            </td>
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
        var selectTataElement = tr.querySelector("#selectNumeTata");
        var selectMamaElement = tr.querySelector("#selectNumeMama");
        var pDesNumeTata = tr.querySelector('[id="numeTata"]');
        var pDesNumeMama = tr.querySelector('[id="numeMama"]');


        saveButton.style.visibility = "hidden";

        editButton.addEventListener("click", handleEditPersonButtonClick); 
        deleteButton.addEventListener("click", handleDeletePersonButtonClick);
        saveButton.addEventListener("click", handleSavePersonButtonClick);
        
       function handleDeletePersonButtonClick() {
            tr.classList.add("mandatoryField");
            var message = `Sunteti sigur ca doriti sa stergeti copilul ${nume} ${prenume} ?`;
            const handlePersonDeleteConfirmation = () => {
                return  () => {
                    document.getElementById("OpenModal").remove();
                    const apiUrl = root + '/deleteChild';
                    child.stergeCopilDinBD(apiUrl)
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
                tr.querySelector("p[id='numeTata']").style.display = "none";
                tr.querySelector("p[id='numeMama']").style.display = "none";

                renderSelectPersonElement(selectTataElement);
                renderSelectPersonElement(selectMamaElement);
                selectTataElement.style.display = "block";
                selectMamaElement.style.display = "block";

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
            const child = new Child(newHtmlDataObj);
            const apiUrl = root + '/editChild';
            child.modificaCopilInBD(apiUrl)
            .then(response => {
                if (response.ok) {   // raspunsul venit de la server e cu status de 200
                        tr.setAttribute("data-editMode","false");
                        var idNumeTata = selectTataElement.value;
                        var numeTata = selectTataElement.querySelector(`option[value="${idNumeTata}"]`).innerText;
                        pDesNumeTata.innerHTML = numeTata;
                        var idNumeMama = selectMamaElement.value;
                        var numeMama = selectMamaElement.querySelector(`option[value="${idNumeMama}"]`).innerText;
                        pDesNumeMama.innerHTML = numeMama;

                    
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
            tr.querySelector("p[id='numeTata']").style.display = "block";
            tr.querySelector("p[id='numeMama']").style.display = "block";
            selectTataElement.style.display = "none";
            selectMamaElement.style.display = "none";
        }

       childrenContainer.appendChild(tr);    

    }); // end of foreach


}
