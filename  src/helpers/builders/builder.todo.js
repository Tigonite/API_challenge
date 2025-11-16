export class BuilderTodo{
    constructor(){
        this.data = {};
        this.validTodoId = Math.floor(Math.random() * 10) + 1;
        this.invalidTodoId = Math.floor(Math.random() * 10) + 11;
    }

    addValidTodoId() {
        this.validTodoId
        return this;
    }

    addInvalidTodoId() {
        this.invalidTodoId;
        return this;
    }

    addDoneStatus(doneStatus = false) {
        this.data.doneStatus = doneStatus;
        return this
    }

    addTitle(title = 'one two three') {
        this.data.title = title;
        return this
    }

    addMaxTitle(title = 'one two three and so on and so on and so on and so') {
        this.data.title = title;
        return this
    }

    addLongTitle(title = 'one two three and so on and so on and so on and so on') {
        this.data.title = title;
        return this
    }

    addDescription(description = 'just bla bla bla') {
        this.data.description = description;
        return this
    }

    addMaxDescription(description = "Turn on, I see red Adrenaline crash and crack my head Nitro junkie, paint me dead And I see red hundred plus through black and white War horse, warhead Fuck 'em man, white-knuckle tight Through blacck") {
        this.data.description = description;
        return this
    }

    addLongDescription(description = "Turn on, I see red Adrenaline crash and crack my head Nitro junkie, paint me dead And I see red hundred plus through black and white War horse, warhead Fuck 'em man, white-knuckle tight Through black and white") {
        this.data.description = description;
        return this
    }

    addOverDescription(description = "Turn on, I see red Adrenaline crash and crack my head Nitro junkie, paint me dead And I see red hundred plus through black and white War horse, warhead Fuck 'em man, white-knuckle tight Through blacck".repeat(26)) {
        this.data.description = description;
        return this
    }

    addPriority(priority = "high") {
        this.data.priority = priority;
        return this
    }

    generate() {
        return {...this.data};
    }
}