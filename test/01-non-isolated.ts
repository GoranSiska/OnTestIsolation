import { expect } from "chai";
import { TodoItemsManager } from "../src/TodoItemsManager";
describe('TodoItemsManager affords integration tests', function() {
    describe('integration tests', function() {
		// An integration test
        it('given TodoItemsManager when TodoItem exists then it can be retrieved', async function() {
            using todoItemsManager = new TodoItemsManager("database.db");
            const task = "Do something"
            const todoItem = todoItemsManager.addTodoItem(task);

            const retrievedTodoItem = todoItemsManager.getTodoItemById(todoItem.id);

            expect(retrievedTodoItem?.task).to.eq(task);
        });
		// An integration test
        it('given TodoItemsManager when TodoItem exists then it can be completed', async function() {
            using todoItemsManager = new TodoItemsManager("database.db");
            const todoItem = todoItemsManager.addTodoItem("Do something");

            todoItemsManager.completeTodoItem(todoItem);

            expect(todoItem.status).to.eq(1);
        });
		// An integration test
        it('given TodoItemsManager when completed TodoItem exists then it can not be completed', async function() {
            using todoItemsManager = new TodoItemsManager("database.db");
            const todoItem = todoItemsManager.addTodoItem("Do something");
            todoItemsManager.completeTodoItem(todoItem);

            expect(() => todoItemsManager.completeTodoItem(todoItem)).to.throw("TodoItem was already completed!");
        });
    });
});




