const BUTTON_NAME = "GOT THAT";

const promptInfoMessage = messageToDisplay => {
    const modalContainer = document.createElement("div");
    modalContainer.id = "OpenModal";
    modalContainer.classList.add("modalDialog");
    modalContainer.innerHTML = 
        `
            <div>
                <p>${messageToDisplay}<p>
                <div>
                    <input type="button" id="hitBtn" value="${BUTTON_NAME}">
                </div>
            </div>
        `
    document.body.appendChild(modalContainer);
    document.getElementById("hitBtn")
        .addEventListener("click", () => document.getElementById("OpenModal").remove());
};

const promptConfirmationMessage = (messageToDisplay, handleConfirmation, handleCancelation) => {
    const modalContainer = document.createElement("div");
    modalContainer.id = "OpenModal";
    modalContainer.classList.add("modalDialog");
    modalContainer.innerHTML = 
        `
            <div>
                <p>${messageToDisplay}<p>
                <div>
                    <input type="button" id="ConfirmationBtn" value="OK">
                    <input type="button" id="RejectionBtn" value="CANCEL">
                </div>    
            </div>
        `
    document.body.appendChild(modalContainer);

    document.getElementById("RejectionBtn")
        .addEventListener("click", () => {
            document.getElementById("OpenModal").remove();
            handleCancelation();
        });
    document.getElementById("ConfirmationBtn")
    .addEventListener("click", () => handleConfirmation());
};

export { promptInfoMessage, promptConfirmationMessage };