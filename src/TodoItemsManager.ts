import DatabaseConstructor, {Database} from "better-sqlite3";
import { TodoItem } from "./TodoItem"
import crypto from "crypto"

export class TodoItemsManager implements Disposable {
    private _db: Database;
    private _todoItems: Array<TodoItem>

    constructor (dbFile: string) {
        this._db = new DatabaseConstructor(dbFile);
        const initDbQuery = `CREATE TABLE IF NOT EXISTS TODO_ITEMS ( ID TEXT, TASK TEXT, STATUS INT )`;
        this._db.exec(initDbQuery);
        const allTodoItemsQuery = `SELECT * FROM TODO_ITEMS`;
        const result = this._db.prepare(allTodoItemsQuery).all();
        this._todoItems = result.map((r:any)=>new TodoItem(r.ID, r.TASK, r.STATUS));
    }
    
    public getTodoItemById(id:string): TodoItem | undefined {
        return this._todoItems.find(i=>i.id === id);
    }
    
    public addTodoItem(task: string): TodoItem {
        const todoItem = new TodoItem(crypto.randomUUID(), task, 0);
        const insertTodoItemQuery = `INSERT INTO TODO_ITEMS VALUES ( $id, $task, $status )`;
        this._db.prepare(insertTodoItemQuery).run({id: todoItem.id, task: todoItem.task, status: todoItem.status});
        this._todoItems.push(todoItem);
        return todoItem
	}

	public completeTodoItem(todoItem: TodoItem) {
        if (todoItem.status != 0) {
            throw new Error("TodoItem was already completed!");
        }
        const newStatus = 1;
        const newTask = todoItem.task + " (DONE)";
        const updateTodoItemByIdQuery = `UPDATE TODO_ITEMS SET TASK = $task, STATUS = $status WHERE ID = $id`;
        this._db.prepare(updateTodoItemByIdQuery).run({id: todoItem.id, task: todoItem.task, status: todoItem.status});
        todoItem.status = newStatus;
        todoItem.task = newTask;
    }

	public [Symbol.dispose]() {
        this._db.close();
    }
}