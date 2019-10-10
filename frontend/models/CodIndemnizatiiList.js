class CodIndemnizatiiList {
    constructor() {
        this.items = [];
    }

    getCodIndemnizatiiList(apiUrl) {
        const self = this;
        return fetch (apiUrl,
            {method: "GET"})
                .then( response => response.json())
                .then ( data => {
                    data.forEach(element => {
                        self.items.push(element);    
                    });
                })
    }
}

export { CodIndemnizatiiList }; 