import crypto from "crypto";
import { TodoItem } from "./TodoItem";

export class TodoItemsLogic {
	private readonly _todoItems: Array<TodoItem>;
	
	constructor(todoItems: Array<TodoItem> = []) {
		this._todoItems = todoItems;
	}

	public createTodoItem(task: string) {
		return new TodoItem(crypto.randomUUID(), task, 0);
	}
	public getTodoItem(id: string): TodoItem | undefined {
		return this._todoItems.find(i => i.id === id);
	}
	public setTodoItem(todoItem: TodoItem) {
		const existingTodoItem = this.getTodoItem(todoItem.id);
		if (existingTodoItem) {
			existingTodoItem.status = todoItem.status;
			existingTodoItem.task = todoItem.task;
		} else {
			this._todoItems.push(todoItem);
		}
	}
	public getAllTodoItems() {
		return this._todoItems;
	}
	public completeTodoItem(id: string) {
		let todoItem = this.getTodoItem(id);
		if (!todoItem) {
			throw new Error("TodoItem does not exist!");
		}
		if (todoItem.status != 0) {
			throw new Error("TodoItem was already completed!");
		}
		let updatedTodoItem = new TodoItem(todoItem.id, todoItem.task, todoItem.status);
		updatedTodoItem.status = 1;
		updatedTodoItem.task += " (DONE)";
		return updatedTodoItem;
	}
}
