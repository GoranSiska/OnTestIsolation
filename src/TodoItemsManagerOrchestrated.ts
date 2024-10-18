import { TodoItem } from "./TodoItem"
import { TodoItemsRepository } from "./TodoItemsRepository";
import { TodoItemsLogic } from "./TodoItemsLogic";

export class TodoItemsManager implements Disposable {
    private readonly _repository!: TodoItemsRepository;
    private readonly _logic!: TodoItemsLogic

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

	public completeTodoItem(id: string) {
        const completedTodoItem = this._logic.completeTodoItem(id);
        this._repository.updateTodoItem(completedTodoItem);
        this._logic.setTodoItem(completedTodoItem);
    }

	public [Symbol.dispose]() {
        this._repository[Symbol.dispose]();
    }
}
