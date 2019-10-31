const bindPropToViev = (obj, prop, view) => {
    if (!obj.__bindingData[prop]) {
        obj.__bindingData[prop] = {bindeViews: []};
    } ;
    obj.__bindingData[prop].bindeViews.push(view);
}

 const createBindedElement = (elementType, obj, prop) => {
     if (!obj.__bindingData) {
         obj.__bindingData = {}
     };
    var bindedElement = document.createElement(elementType);
    bindedElement.setAttribute("data-propName",`${prop}`);
    bindedElement.classList.add("editableTableCell")
    bindPropToViev(obj,prop,bindedElement);
    return bindedElement;
 }   


 export { createBindedElement };