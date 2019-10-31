import { createDisplayTableCell } from "./createDisplayTableCell.js";

const createDisplayTableRow = (obj, index) => {
    var tr = document.createElement("tr");
    tr.setAttribute("data-editMode","false");
    var td = document.createElement("td");  // nr crt
    td.innerText = index + 1;
    tr.appendChild(td);

    const objKeys = Object.keys(obj);
    objKeys.forEach( prop => {
        tr.appendChild(createDisplayTableCell(obj, prop));
    })

    var td = document.createElement("td");  
    td.innerHTML = `
        <span title="Editeaza" id="editBtn" class="editRowBtn">
            <i class="fas fa-pen"></i>
            <span>Edit</span>
        </span>
        <span title="Sterge" id="deleteBtn" class="deleteRowBtn">
            <i class="fas fa-trash-alt"></i>  
            <span>Delete</span>
        </span>
        <span title="Save" id="saveChangesBtn" class="saveChangesBtn">
            <span>Save</span>
        </span>
        `
    tr.appendChild(td);

    return tr;
} 

export { createDisplayTableRow };