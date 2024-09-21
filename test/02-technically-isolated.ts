import { expect } from "chai";
import { TodoItemsManager as TodoItemsManagerWithInjection } from "../src/TodoItemsManagerWithInjection";
import { TodoItemsRepository } from "../src/TodoItemsRepository";
import sinon from "sinon";
import { TodoItem } from "../src/TodoItem";

describe('TodoItemsManagerWithInjection affords partially isolated tests', function() {
    describe('integration tests', async function() {
		// An integration test
		it('given TodoItemsManager when completed TodoItem exists then it can not be completed', async function() {
			const repository = new TodoItemsRepository("database.db");
			using todoItemsManager = new TodoItemsManagerWithInjection(repository);
			const todoItem = todoItemsManager.addTodoItem("Do something");
			todoItemsManager.completeTodoItem(todoItem);

			expect(() => todoItemsManager.completeTodoItem(todoItem)).to.throw("TodoItem was already completed!");
		});
    });
    describe('technically isolated tests', function() {
		// A technically isolated test with material dependencies
        it('given TodoItemsManagerWithInjection when TodoItem exists then it can be completed', function() {
            const todoItem = new TodoItem("A", "Do something", 0);
						const repository = sinon.createStubInstance(TodoItemsRepository);
						repository[Symbol.dispose] = sinon.stub<[], void>();
            using todoItemsManager = new TodoItemsManagerWithInjection(repository);
            
            todoItemsManager.completeTodoItem(todoItem);

            expect(todoItem.status).to.eq(1);
        });
		// This is overspecified test, too tied to implementation
        it('given TodoItemsManagerWithInjection when completing TodoItem then updateTodoItem is called', function() {
            const todoItem = new TodoItem("A", "Do something", 0);
            const repository = sinon.createStubInstance(TodoItemsRepository);
            repository[Symbol.dispose] = sinon.stub<[], void>();
            using todoItemsManager = new TodoItemsManagerWithInjection(repository);
            
            todoItemsManager.completeTodoItem(todoItem);

            expect(repository.getAllTodoItems.calledOnce).to.eq(true);
        });
		// This is almost ok
        it('given TodoItemsManagerWithInjection when completed TodoItem exists then it can not be completed', function() {
            const todoItem = new TodoItem("A", "Do something", 1);
            const repository = sinon.createStubInstance(TodoItemsRepository);
            repository[Symbol.dispose] = sinon.stub<[], void>();
            using todoItemsManager = new TodoItemsManagerWithInjection(repository);
            
            expect(() => todoItemsManager.completeTodoItem(todoItem)).to.throw("TodoItem was already completed!");
        });
    });
});




