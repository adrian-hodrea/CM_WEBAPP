class ChildrenList {
    constructor() {
        this.items = [];
    }

    getChildrenList (apiUrl) {
        const self = this;
        return fetch(apiUrl, {
            method: "GET"
        })
        .then(responseObject => responseObject.json())
        .then(bodyData => {
            bodyData.forEach(element => {
                self.items.push(element);    
            });
        })
    }
}

export { ChildrenList };