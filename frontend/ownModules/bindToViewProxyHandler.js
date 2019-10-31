var handler = {
    set (target, prop, value) {
        target[prop] = value;
        if(target.__bindingData) {
            target.__bindingData[prop].bindeViews.forEach(element => {
                element.innerText = value;
            });    
        }
        return true;
    }
}

export { handler };