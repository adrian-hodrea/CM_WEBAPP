function restoreDataBeforeEdit(editableCells,objToReadFrom) {
    editableCells.forEach(element => {
        var propName = element.getAttribute("data-propName");
        var textToRestore = objToReadFrom[propName];
        element.innerText = textToRestore;
    });
};    


export { restoreDataBeforeEdit };