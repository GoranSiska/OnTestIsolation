import DatabaseConstructor, {Database} from "better-sqlite3";
import { TodoItem } from "./TodoItem"

export class TodoItemsRepository implements Disposable {
    private _db: Database;

    constructor (dbFile: string) {
        this._db = new DatabaseConstructor(dbFile);
        const initDbQuery = `CREATE TABLE IF NOT EXISTS TODO_ITEMS ( ID TEXT, TASK TEXT, STATUS INT )`;
        this._db.exec(initDbQuery);
    }

    public updateTodoItem(todoItem: TodoItem) {
        const updateTodoItemByIdQuery = `UPDATE TODO_ITEMS SET TASK = $task, STATUS = $status WHERE ID = $id`;
        this._db.prepare(updateTodoItemByIdQuery).run(this.toParameters(todoItem));
    }
    
	public insertTodoItem(todoItem: TodoItem) {
        const insertTodoItemQuery = `INSERT INTO TODO_ITEMS VALUES ( $id, $task, $status )`;
        this._db.prepare(insertTodoItemQuery).run(this.toParameters(todoItem));
    }   
    
	public getAllTodoItems(): Array<TodoItem> {
        const allTodoItemsQuery = `SELECT * FROM TODO_ITEMS`;
        let result: Array<TodoItem> = new Array<TodoItem>();
        for (const row of this._db.prepare(allTodoItemsQuery).iterate()) {
            if(row) {
                result.push(this.toTodoItem(row));
            }
        }
        return result;
    }

    private toParameters(todoItem: TodoItem): any {
        return {id: todoItem.id, task: todoItem.task, status: todoItem.status}
    }
    
	private toTodoItem(record: any): TodoItem {
        return new TodoItem(record.ID, record.TASK, record.STATUS)
    }

	public [Symbol.dispose]() {
        this._db.close();
    }
}