import { TodoActionsContext, TodoContext, type TodoContextState } from "@/context/todos_store"
import type { TodoSection } from "@/types/section";
import { use } from "react"

export const useTodoContext = () => {

  const context = use(TodoContext) as TodoContextState;

  if (!context) {
    throw new Error("useTodoContext must be used within a TodoContextProvider and TodoActionsContextProvider");
  }

  return { sections: context.sections };
}

export const useTodoActions = () => {
  const actions = use(TodoActionsContext);
  if (!actions) {
    throw new Error("useTodoActions must be used within a TodoActionsContextProvider");
  }
  return actions;
}

export const getSectionTodoStatus = (section: TodoSection): { total: number, done: number } | null => {

  if (section.todos.length <= 0) {
    return null
  }

  let counter = 0;
  section.todos.forEach(todo => {
    if (todo.done) counter++;
  });

  return {
    total: section.todos.length,
    done: counter
  };
}