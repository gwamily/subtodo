import { defaultTodoContextState, TodoActionsContext, TodoContext, type TodoContextState } from "@/context/todos_store";
import { makeNewTodoSection } from "@/types/section";
import { makeNewTodo } from "@/types/todo";
import { useEffect, useState, type PropsWithChildren } from "react";

interface TodoContextProviderProps extends PropsWithChildren { }

const TODO_LOCAL_STORAGE_KEY = "todos";

export const TodoContextProvider: React.FC<TodoContextProviderProps> = ({ children }) => {

  const [state, setState] = useState<TodoContextState>(load())

  const save = () => {
    try {
      localStorage.setItem(TODO_LOCAL_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save todos:", error);
    }
  }

  function load(): TodoContextState {
    try {
      const saved = localStorage.getItem(TODO_LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultTodoContextState;
    } catch (error) {
      console.error("Failed to load todos:", error);
      return defaultTodoContextState
    }
  }

  const addSection = (title: string) => {
    const newSection = makeNewTodoSection(title);
    setState({
      sections: [...state.sections, newSection]
    });
  }


  const removeSection = (index: number) => {
    const updatedSections = state.sections.filter((_, i) => i !== index);
    setState({
      sections: updatedSections
    });
  }

  const addTodoToSection = (index: number, title: string) => {
    const newTodo = makeNewTodo(title);

    setState(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) => {
        if (i !== index) return section;

        const updatedTodos = [...section.todos, newTodo];

        return {
          ...section,
          todos: updatedTodos,
          isDone: false
        };
      })
    }));
  };

  const removeTodoFromSection = (sectionIndex: number, todoIndex: number) => {
    const section = state.sections[sectionIndex];
    if (!section) return;
    const updatedTodos = section.todos.filter((_, i) => i !== todoIndex);
    const updatedSection = {
      ...section,
      todos: updatedTodos
    };
    const updatedSections = [...state.sections];
    updatedSections[sectionIndex] = updatedSection;
    setState({
      sections: updatedSections
    });
  }

  const toggleSectionDone = (sectionIndex: number) => {
    const section = state.sections[sectionIndex];
    if (!section) return;
    const updatedSection = {
      ...section,
      isDone: !section.isDone
    };
    const updatedSections = [...state.sections];
    updatedSections[sectionIndex] = updatedSection;
    setState({
      sections: updatedSections
    });
  }

  const toggleSectionTodoDone = (sectionIndex: number, todoIndex: number) => {

    const section = state.sections[sectionIndex];
    if (!section) return;

    const updatedTodos = section.todos.map((todo, idx) =>
      idx === todoIndex ? { ...todo, done: !todo.done, updatedAt: new Date() } : todo
    );

    const allTodosFinished = updatedTodos.every(todo => todo.done);
    const updatedSection = {
      ...section,
      todos: updatedTodos,
      isDone: allTodosFinished
    };

    const updatedSections = [...state.sections];
    updatedSections[sectionIndex] = updatedSection;

    setState({
      sections: updatedSections
    });

  }
  useEffect(() => {
    save();
  }, [state.sections])


  useEffect(() => {
    setState(load())
  }, [])

  return (
    <TodoActionsContext.Provider value={{ addSection, addTodoToSection, removeSection, removeTodoFromSection, toggleSectionDone, toggleSectionTodoDone }}>
      <TodoContext.Provider value={state}>
        {children}
      </TodoContext.Provider>
    </TodoActionsContext.Provider>
  )
}

