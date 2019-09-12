class PersonsList {
    constructor() {
        this.items = [];
    }

    getPersonsList (apiUrl) {
        const self = this;
        return fetch(apiUrl, {
            method: "GET"
        })
        .then(response => response.json())
        .then(bodyData => {
            bodyData.forEach(element => {
                self.items.push(element);    
            });
        })
    }
}
