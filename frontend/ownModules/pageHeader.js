import { MenuTree } from "../models/MenuTree.js";

const renderPageHeader = () => {
    document.getElementById("pageHeader").innerHTML =
    `
        <div id="greyTopRibbon"></div>
        <div id="appBrand"><a href="http://127.0.0.1:3000">Simplisis</a></div>
        <nav id="menuTreeContainer"></nav>
    `
};

const renderMenuTree = () => {
    const menu = new MenuTree();
    const root = window.localStorage.getItem("root");
    const menuTreeApi = root + "/getMenuTree";
    var menuContainer = document.getElementById("menuTreeContainer");
    menu.getMenuList(menuTreeApi).then( () => {
        var menuTree = menu.items;
        renderTreeToHTML(menuContainer,menuTree,"mainMenu");
    });
}; // end of renderMenuTree

function renderTreeToHTML(menuContainer,menuTree,menuType, ownerOfMenu) {
    var ulElement = document.createElement("ul");
    if (menuType !== 'mainMenu') {
        if (ownerOfMenu === 'mainMenu') {
            ulElement.classList.add("firstLevelMenu");          // apply different design(vertical) on submenu then main menu
        }  else {
            ulElement.classList.add("secondLevelMenu");          // apply different design(vertical) on submenu then main menu           
        }               
    }
    menuTree.forEach( (elementObj, index) => {
        var liItemElement = document.createElement("li");
        var menuItemElement = document.createElement("span");
        liItemElement.appendChild(menuItemElement);
        liItemElement.setAttribute("menuReleased","false");
        liItemElement.setAttribute("data-id",`${elementObj.id}`);
        if (menuType ==="mainMenu") { // Horizontal Main menu item
            menuItemElement.innerText = `${elementObj.name}`;
            if (index < menuTree.length - 1) {
                liItemElement.style.borderRight = "1px solid lightgrey";
            }
        }
            else {  // Vertical submenu item
                if (index < menuTree.length - 1) {
                    liItemElement.style.borderBottom = "1px solid lightgrey";
                }    
                menuItemElement.innerHTML = `
                    <span class="menuItemType${elementObj.type}">${elementObj.type}</span>    
                    <span class="menuItemText">${elementObj.name}</span>
                    <i class="fas fa-angle-right"></i>
                `;
            }    
        ulElement.appendChild(liItemElement);
        if (elementObj.children) {
            menuItemElement.addEventListener("click",createSubmenuOnClick());
        }    

        function createSubmenuOnClick() {
            return () => {
                var releasedMenu = menuItemElement.parentElement.getAttribute("menuReleased");
                removeSiblingMenu();
                if (releasedMenu === "false") {
                    menuItemElement.parentElement.setAttribute("menuReleased","true");
                    renderTreeToHTML(liItemElement,elementObj.children,"subMenu",menuType);    
                }
            }



        }

        function removeSiblingMenu() {
            var openedMenuItem = ulElement.querySelector('li[menuReleased="true"]');
            if (openedMenuItem) {
                var submenu = openedMenuItem.querySelector('ul');
                submenu.parentElement.removeChild(submenu); 
                openedMenuItem.setAttribute("menuReleased","false");   
            }
        }

    });
    menuContainer.appendChild(ulElement);
} ; 
    

export {renderPageHeader,renderMenuTree};