import crypto from "crypto"
import { TodoItem } from "./TodoItem"
import { TodoItemsRepository } from "./TodoItemsRepository";

export class TodoItemsManager implements Disposable {
    private _repository: TodoItemsRepository;
    private _todoItems: Array<TodoItem>

    public constructor(repository: TodoItemsRepository) {
        this._repository = repository;
        this._todoItems = this._repository.getAllTodoItems();
    }
    
    public getTodoItemById(id:string): TodoItem | undefined {
        return this._todoItems.find(i=>i.id === id);
    }
    
    public addTodoItem(task: string): TodoItem {
        const todoItem = new TodoItem(crypto.randomUUID(), task, 0);
        this._repository.insertTodoItem(todoItem);
        this._todoItems.push(todoItem);
        return todoItem
    }

	public completeTodoItem(todoItem: TodoItem) {
        if (todoItem.status != 0) {
            throw new Error("TodoItem was already completed!");
        }
        const completedTodoItem = new TodoItem(todoItem.id, todoItem.task + " (DONE)", 1);
        this._repository.updateTodoItem(completedTodoItem);
        todoItem.status = completedTodoItem.status;
        todoItem.task = completedTodoItem.task;
    }

	public [Symbol.dispose]() {
        this._repository[Symbol.dispose]();
    }
}