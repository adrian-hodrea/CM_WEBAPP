const root = "http://127.0.0.1:3000";
const  listaPersoane = new PersonsList();
const apiUrl = root + '/getpersons';
listaPersoane.getPersonsList(apiUrl)
.then( () => appendPersons(listaPersoane.items));

const appendPersons = (listOfPersons) => {
    const personsContainer = document.getElementById("personsContainerBody");
    listOfPersons.forEach( (element, index) => {
        var persoana = new Persoana(element);
        var tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${index+1}</td>
            <td>${persoana.nume}</td>
            <td>${persoana.prenume}</td>
            <td>${persoana.cnp}</td>
            <td>-</td>
            <td>${persoana.seriaCI}</td>
            <td>${persoana.numarCI}</td>
            <td>${persoana.eliberatDeCI}</td>
            <td>${persoana.dataEliberariiCI}</td>
            <td>${persoana.localitatea}</td>
            <td>${persoana.strada}</td>
            <td>${persoana.nrStrada}</td>
            <td>${persoana.bloc}</td>
            <td>${persoana.scara}</td>
            <td>${persoana.nrApartament}</td>
            <td>${persoana.judet}</td>
            <td>${persoana.sector}</td>
            <td>${persoana.telefon}</td>
            <td>
                <i title="Editeaza" class="editPerson fas fa-pen"></i>
                <i title="Sterge" class="deletePerson fas fa-trash-alt"></i>    
            </td>             
            `; 
        tr.lastElementChild.firstElementChild.addEventListener("click", () => alert("Editeaza"));
        tr.lastElementChild.lastElementChild.addEventListener("click", 
             handleDeletePerson(persoana.nume, persoana.prenume, persoana.cnp));
       
        function handleDeletePerson(nume, prenume, cnp)  {
            return () => {
                var message = `Sunteti sigur ca doriti sa stergeti persoana ${nume} ${prenume} ?`;
                const handlePersonDeleteConfirmation = (nume, prenume) => {
                    return  () => alert("S-a sters din baza de date persoana" + nume + prenume);}
                promptConfirmationMessage(message, handlePersonDeleteConfirmation(nume,prenume));    
            }

        }; // end of handleDeletePerson



        personsContainer.appendChild(tr);

    }); // end of foreach
}

