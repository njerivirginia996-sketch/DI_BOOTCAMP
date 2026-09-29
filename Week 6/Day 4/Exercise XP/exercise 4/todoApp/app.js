import { TodoList } from "./todo.js";

const todoList = new TodoList();

todoList.addTask("Learn Node.js");
todoList.addTask("Learn Express.js");
todoList.addTask("Practice JavaScript");

todoList.markTaskComplete(0);
todoList.markTaskComplete(2);

todoList.listTasks();