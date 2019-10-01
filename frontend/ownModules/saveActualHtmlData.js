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

export { saveActualHtmlData };