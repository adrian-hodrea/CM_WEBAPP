import { createBindedElement } from "./createBindedElement.js";

const createDisplayTableCell = (obj, prop) => {
    var td = document.createElement("td");
    td.appendChild(createBindedElement("p",obj,prop));
    return td;
}

export { createDisplayTableCell };

