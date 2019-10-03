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
        //menuContainer.innerHTML = renderTreeToHTML(menu.items);
        renderTreeToHTML(menuContainer,menu.items);
    });

    function renderTreeToHTML(menuContainer,menuTree) {
        var ulElement = document.createElement("ul");
        menuTree.forEach( (element, index) => {
            var menuElement = document.createElement("li");
            menuElement.setAttribute("data-id",`${element.id}`);
            if (element.id < 0) { // Horizontal Main menu item
                menuElement.innerText = `${element.name}`;
                if (index < menuTree.length - 1) {
                    menuElement.style.borderRight = "1px solid lightgrey";
                }
            }
                else {  // Vertical submenu item
                    if (index < menuTree.length - 1) {
                        menuElement.style.borderBottom = "1px solid lightgrey";
                    }    
                    menuElement.innerHTML = `
                        <span class="menuItemType${element.type}">${element.type}</span>    
                        ${element.name}
                        <i class="fas fa-angle-right"></i>
                    `;
                    ulElement.classList.add("firstLevelMenu");
                }    
            ulElement.appendChild(menuElement);
            if (element.children) {
                menuElement.addEventListener("click",(function() {
                    return () => renderTreeToHTML(menuElement,element.children);
                })()   
                );
            }    

        });
        menuContainer.appendChild(ulElement);
    } ; 
    
};

export {renderPageHeader,renderMenuTree};