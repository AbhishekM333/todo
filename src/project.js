class project {

    constructor(name) {
        this.name = name;
        this.todos = []
    }

    addtodo(todo) {
        this.todos.push(todo);

    }
    removetodo(todo) {
        this.todos = this.todos.filter(t => t !== todo);
    }
}


export default project;





