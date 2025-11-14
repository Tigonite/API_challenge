export class BuilderTodo{
    addValidTodoId() {
        this.ValidTodoId = Math.floor(Math.random() * 10) + 1;
        return this;
    }

    addInvalidTodoId() {
        this.ValidTodoId = Math.floor(Math.random() * 10) + 11;
        return this;
    }

    generate() {
        return {...this};
    }
}