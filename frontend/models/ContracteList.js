class ContracteList {
    constructor() {
        this.items = [];
    }

    getContracteList(apiUrl) {
        const self = this;
        return fetch(apiUrl, 
            {method : "GET"})
                .then( response => response.json())
                .then (data => {
                    data.forEach(element => {
                        self.items.push(element);
                    });
                })
    }
}

export { ContracteList }; 