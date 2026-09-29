export class TodoList {
    constructor() {
        this.tasks = [];
    }

    addTask(task) {
        this.tasks.push({
            task: task,
            completed: false
        });
    }

    markTaskComplete(index) {
        if (this.tasks[index]) {
            this.tasks[index].completed = true;
        }
    }

    listTasks() {
        console.log(this.tasks);
    }
}