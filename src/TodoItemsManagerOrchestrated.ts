import { TodoItem } from "./TodoItem"
import { TodoItemsRepository } from "./TodoItemsRepository";
import { TodoItemsLogic } from "./TodoItemsLogic";

export class TodoItemsManager implements Disposable {
    private _repository!: TodoItemsRepository;
    private _logic!: TodoItemsLogic

    public constructor(repository: TodoItemsRepository) {
        this._repository = repository;
		this._logic = new TodoItemsLogic(this._repository.getAllTodoItems());
    }
    
    public getTodoItemById(id:string): TodoItem | undefined {
        return this._logic.getTodoItem(id);
    }
	   
    public addTodoItem(task: string): TodoItem {
        const addedTodoItem = this._logic.createTodoItem(task);
        this._repository.insertTodoItem(addedTodoItem);
        this._logic.setTodoItem(addedTodoItem);
        return addedTodoItem;
    }

	public completeTodoItem(todoItem: TodoItem) {
        const completedTodoItem = this._logic.completeTodoItem(todoItem);
        this._repository.updateTodoItem(completedTodoItem);
        this._logic.setTodoItem(completedTodoItem);
    }

	public [Symbol.dispose]() {
        this._repository[Symbol.dispose]();
    }
}
