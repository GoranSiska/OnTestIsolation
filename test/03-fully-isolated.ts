import { expect } from "chai";
import { TodoItemsManager as TodoItemsManagerOrchestrated } from "../src/TodoItemsManagerOrchestrated";
import { TodoItemsLogic } from "../src/TodoItemsLogic";
import { TodoItem } from "../src/TodoItem";
import { TodoItemsRepository } from "../src/TodoItemsRepository";
import sinon from "sinon";

describe('TodoItemsManagerOrchestrated affords fully isolated tests', function() {
    describe('integration tests', function() {
		it('given TodoItemsManager when completed TodoItem exists then it can not be completed', async function() {
			const repository = new TodoItemsRepository("database.db");
			using todoItemsManager = new TodoItemsManagerOrchestrated(repository);
			const todoItem = todoItemsManager.addTodoItem("Do something");
			todoItemsManager.completeTodoItem(todoItem.id);

			expect(() => todoItemsManager.completeTodoItem(todoItem.id)).to.throw("TodoItem was already completed!");
		});
    });
    describe('fully isolated tests', function() {
				// This is an integration test, hiding in an unit test suite
        it('given TodoItemsManagerOrchestrated when completed TodoItem exists then it can not be completed', function() {
            const todoItem = new TodoItem("A", "Do something", 1);
            const repository = sinon.createStubInstance(TodoItemsRepository);
			repository.getAllTodoItems.returns([todoItem]);
            repository[Symbol.dispose] = sinon.stub<[], void>();
            using todoItemsManager = new TodoItemsManagerOrchestrated(repository);

            expect(() => todoItemsManager.completeTodoItem(todoItem.id)).to.throw("TodoItem was already completed!");
        });
        it('given TodoItemsLogic when completed TodoItem exists then it can not be completed', function() {
			const todoItem = new TodoItem("A", "Do something", 1);
			//const repository = sinon.createStubInstance(TodoItemsRepository);
			//repository.getAllTodoItems.returns([todoItem]);
			//repository[Symbol.dispose] = sinon.stub<[], void>();
			const logic = new TodoItemsLogic();
			logic.setTodoItem(todoItem);
			//using todoItemsManager = new TodoItemsManagerOrchestrated(repository);

			//todoItemsManager
			expect(() => logic.completeTodoItem(todoItem.id)).to.throw("TodoItem was already completed!");
        });
			it('given TodoItemsLogic when TodoItem is completed then its task description changes', function() {
				const todoItem = new TodoItem("A", "Do something", 0);
				const logic = new TodoItemsLogic()
				logic.setTodoItem(todoItem);

				const completedTodoItem = logic.completeTodoItem(todoItem.id);

				expect(completedTodoItem.task).to.eq("Do something (DONE)");
		});
    });
});




