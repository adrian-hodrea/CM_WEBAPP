import { renderPageHeader,renderMenuTree } from "../ownModules/pageHeader.js";

document.addEventListener('DOMContentLoaded', onHtmlLoaded);

function onHtmlLoaded() {

const root = "http://127.0.0.1:3000";
window.localStorage.setItem("root" , `${root}`);

renderPageHeader();
renderMenuTree();

/* End of getting Menu Tree data */


/* Favorites buttons */
document.getElementById("personManag").addEventListener("click", function() {
    simulateButtonClick(this);
    handlePersMngmtClick(this);
});

document.getElementById("CMManag").addEventListener("click", function() {
    simulateButtonClick(this);
    handleCmMngmtClick(this);
    
});


const handlePersMngmtClick = (button) => {
    var cmMngmtButton = document.getElementById("CMManag");
    var cmMngmtMenu = document.getElementById("cmMngmtMenuOptionsContainer");
    removeSiblingMenu(cmMngmtMenu,cmMngmtButton);
    var menuReleasedFlag = button.getAttribute("data-menuReleasedFlag");
    if (menuReleasedFlag != "Y") {
        var menuOptionsContainer = document.createElement("div");
        menuOptionsContainer.id = "persMngmtMenuOptionsContainer";
        menuOptionsContainer.classList.add("menuOptionsContainer");
        
        var adaugaPersoaneBtn = menuButtonCreator('fas fa-user-plus','Adauga Persoana');
        var listeazaPersoanaBtn = menuButtonCreator('fas fa-address-book','Listeaza Persoane');
        var adaugaCopil = menuButtonCreator('fas fa-child','Adauga Copil');
        var listeazaCopil = menuButtonCreator('fas fa-address-book','Listeaza Copii');
    
        adaugaPersoaneBtn.addEventListener("click", function() {
            simulateButtonClick(this);   
            const addPersonUrl = root + "/frontend/pages/addPerson.html";
            window.open(addPersonUrl);
        });
        listeazaPersoanaBtn.addEventListener("click", function() {
            simulateButtonClick(this);  
            const allPersonsUrl = root + "/frontend/pages/displayPersons.html"; 
            window.open(allPersonsUrl);
        });
        adaugaCopil.addEventListener("click", function() {
            simulateButtonClick(this);   
            const addChildUrl = root + "/frontend/pages/addChild.html";
            window.open(addChildUrl);
        });
        listeazaCopil.addEventListener("click", function() {
            simulateButtonClick(this);   
            const allChildrendUrl = root + "/frontend/pages/displayChildren.html";
            window.open(allChildrendUrl);
        });


        menuOptionsContainer.appendChild(adaugaPersoaneBtn);
        menuOptionsContainer.appendChild(listeazaPersoanaBtn);
        menuOptionsContainer.appendChild(adaugaCopil);
        menuOptionsContainer.appendChild(listeazaCopil);

//        document.body.appendChild(menuOptionsContainer);
        button.appendChild(menuOptionsContainer);

        button.setAttribute("data-menuReleasedFlag","Y");
    } // end of   -- if (menuReleasedFlag != "Y")  --
} // end of -- const handlePersMngmtClick = (button) =>   --

const handleCmMngmtClick = (button) => {
    var persMngmtButton = document.getElementById("personManag");
    var persMngmtMenu = document.getElementById("persMngmtMenuOptionsContainer");
    removeSiblingMenu(persMngmtMenu,persMngmtButton);
    var menuReleasedFlag = button.getAttribute("data-menuReleasedFlag");
    if (menuReleasedFlag != "Y") {
        var menuOptionsContainer = document.createElement("div");
        menuOptionsContainer.id = "cmMngmtMenuOptionsContainer";
        menuOptionsContainer.classList.add("menuOptionsContainer");
        
        var adaugaCmBtn = menuButtonCreator('fas fa-file-invoice','Adauga Concediu Medical');
        var listeazaCmBtn = menuButtonCreator('fas fa-file-invoice','Listeaza Concedii Medicale');


        adaugaCmBtn.addEventListener("click", function() {
            simulateButtonClick(this);   
            const addPersonUrl = root + "/frontend/pages/addConcediuMedical.html";
            window.open(addPersonUrl);
        });

        listeazaCmBtn.addEventListener("click", function() {
            simulateButtonClick(this);   
            const addPersonUrl = root + "/frontend/pages/displayConcediiMedicale.html";
            window.open(addPersonUrl);
        });



        menuOptionsContainer.appendChild(adaugaCmBtn);
        menuOptionsContainer.appendChild(listeazaCmBtn);


//        document.body.appendChild(menuOptionsContainer);
        button.appendChild(menuOptionsContainer);

        button.setAttribute("data-menuReleasedFlag","Y");
    } // end of   -- if (menuReleasedFlag != "Y")  --

} // end of -- const handleCmMngmtClick = (button) =>   --



const simulateButtonClick = button => {
    button.style.borderColor = "lightgrey";
    button.style.backgroundColor = "#3481ab";
    setTimeout(() => { button.style.borderColor = "#2b607e"}, 80);  

}

function menuButtonCreator (iconClass, text) {
    var button = document.createElement("div");
    button.innerHTML = `
        <div>
            <i class="${iconClass}"></i>
        </div>
        <p>${text}</p>
    ` ;
    button.classList.add("menuButtons");
    return button;
}

function removeSiblingMenu (siblingMenu, siblingButton) {
    if (siblingMenu) {
        siblingMenu.parentElement.removeChild(siblingMenu);
        var color = document.querySelector(":root").style.getPropertyValue("--to-gradient-body-color");
        siblingButton.style.backgroundColor = color; 
        siblingButton.setAttribute("data-menuReleasedFlag","");

    }
}

}; // end of onHtmlLoaded
