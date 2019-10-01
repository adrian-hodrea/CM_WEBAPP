const checkMandatoryFields = (parentElement) => {
    const requiredFields = parentElement.querySelectorAll("input[required], select[required]");
    var allRequiredFieldsOK = true;
    requiredFields.forEach( (item)=> {
        if (item.value === "") {
            allRequiredFieldsOK = false;
            item.classList.add("mandatoryField");
        }
        else {
            item.style.border = "none";
        }
    })
    return allRequiredFieldsOK;
}

export { checkMandatoryFields };