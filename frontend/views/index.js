/* Get Menu Tree data */
const root = "http://127.0.0.1:3000";
window.localStorage.setItem("root" , `${root}`);
var menu = new MenuTree();
const menuTreeApi = root + "/getMenuTree";
menu.getMenuList(menuTreeApi).then( () => {
    var menuContainer = document.getElementById("menuTreeContainer");
    menuContainer.innerHTML = renderTreeToHTML(menu.items);
}
);

/* End of getting Menu Tree data */

function renderTreeToHTML(tree) {
    html = "";
    tree.forEach( function(element, index)  {
        html += `<li data-id="${element.id}">${element.name}</li>`;
        if (index < tree.length - 1) {
            html += `<span>|</span>`;
        };
    });
    html += "</ul>"
    return html;
} 


/*
function renderTreeToHTML(tree) {
    html += "<div>";
    tree.forEach( function(element)  {
        html += `<div>${element.name}`;
        if (element.children)  renderTreeToHTML(element.children);
        html += "</div>";
    });
    html += "</div>"
    return html;
} */

/* Favorites buttons */
document.getElementById("personManag").addEventListener("click", function() {
    simulateButtonClick(this);
    handlePersMngmtClick(this);
});

document.getElementById("CMManag").addEventListener("click", function() {
    simulateButtonClick(this);
});



const handlePersMngmtClick = (button) => {
    var menuReleasedFlag = button.getAttribute("data-menuReleasedFlag");
    if (menuReleasedFlag != "Y") {
        var PMMenuContainer = document.createElement("div");
        PMMenuContainer.style.cssText = `
                position: relative;
                top: 126px;
                left: 50%;
                transform: translate(-60%, -60%);
                height: 110px; 
                width: 300px;     
              `;    
        
        PMMenuContainer.id = "PMMenuContainer";
        
        var PMOpt1 = document.createElement("div");
        var PMOpt2 = document.createElement("div");
    
        PMOpt1.innerHTML =
                `
                    <div>
                        <i class="fas fa-user-plus"></i>
                    </div>
                    <p>Adauga Persoana</p>
                ` ;
        PMOpt2.innerHTML =
                `
                    <div>
                        <i class="fas fa-address-book"></i>
                    </div>
                    <p>Listeaza Persoane</p>
                ` ;

        PMOpt1.classList.add("buttonsLvl1");
        PMOpt2.classList.add("buttonsLvl1");

        PMOpt1.addEventListener("click", function() {
            simulateButtonClick(this);   
            const addPersonUrl = root + "/frontend/pages/addPerson.html";
            window.open(addPersonUrl);
        });
        PMOpt2.addEventListener("click", function() {
            simulateButtonClick(this);  
            const allPersonsUrl = root + "/frontend/pages/displayPersons.html"; 
            window.open(allPersonsUrl);
        });

        PMMenuContainer.appendChild(PMOpt1);
        PMMenuContainer.appendChild(PMOpt2);

        document.body.appendChild(PMMenuContainer);
        button.setAttribute("data-menuReleasedFlag","Y");
    } // end of   -- if (menuReleasedFlag != "Y")  --
} // end of -- const handlePersMngmtClick = (button) =>   --

const simulateButtonClick = button => {
    button.style.borderColor = "lightgrey";
    button.style.backgroundColor = "#3481ab";
    setTimeout(() => { button.style.borderColor = "#2b607e"}, 80);  

}

/* End of Favorites buttons */