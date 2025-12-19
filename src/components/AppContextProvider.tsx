import { LOCALSTORAGE_LAST_SELECTED_PROJECT, LOCALSTORAGE_PROJECTS_KEY } from '@/constants';
import { AppContext, AppDispatchContext, type AppDispatch } from '@/context/app_store'
import { makeNewProject, type Project } from '@/types/project';
import { makeNewTodoSection } from '@/types/section';
import { makeNewTodo } from '@/types/todo';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

type Props = {} & React.PropsWithChildren;

export const AppContextProvider: React.FC<Props> = ({ children }) => {

  const [currentProject, setCurrentProject] = useState<string | null>(loadLastSelectedProject());
  const [projects, setProjects] = useState<Project[]>(loadProjects())

  const createProject: AppDispatch['createProject'] = (name: string) => {
    const newProject = makeNewProject(name);
    if (projects.find(p => p.slug === newProject.slug)) {
      toast.error("Project with this name already exists");
      return
    }
    setProjects([...projects, newProject]);
    setCurrentProject(newProject.id)
  }

  const removeProject: AppDispatch['removeProject'] = (id: string) => {
    const projectsFiltered = projects.filter(p => p.id !== id);
    setProjects(projectsFiltered);
  }

  const selectProject: AppDispatch['selectProject'] = (id: string | null) => {
    if (!id === null || id === '') {
      setCurrentProject(null);
      return
    }

    const project = projects.find(p => p.id === id);
    if (project) {
      setCurrentProject(project.id);
      saveLastSelectedProject(project.id);
    } else {
      setCurrentProject(null);
    }
  }

  const projectList = useMemo(() => {
    return projects.map((p, _i) => ({
      name: p.name,
      id: p.id,
      slug: p.slug,
    }))
  }, [projects])

  function saveProjects() {
    try {
      localStorage.setItem(LOCALSTORAGE_PROJECTS_KEY, JSON.stringify(projects));
    } catch (error) {
      toast.error("Failed to save projects");
    }
  }

  function loadProjects() {
    try {
      const data = localStorage.getItem(LOCALSTORAGE_PROJECTS_KEY);
      if (data) {
        const parsed: Project[] = JSON.parse(data);
        return parsed;
      } else {
        return [];
      }
    } catch (error) {
      toast.error("Failed to load projects");
      return []
    }
  }

  function loadLastSelectedProject() {
    try {
      const data = localStorage.getItem(LOCALSTORAGE_LAST_SELECTED_PROJECT);
      if (data)
        return data;
      return null
    }
    catch (error) {
      toast.error("Failed to load last selected project");
    }
    return null;
  }

  function saveLastSelectedProject(projectId: string | null) {
    if (projectId === null) return;
    try {
      localStorage.setItem(LOCALSTORAGE_LAST_SELECTED_PROJECT, projectId);
    } catch (error) {
      console.error("Failed to save last selected project to localStorage", error);
    }
  }

  useEffect(() => {
    saveProjects();
  }, [projects])

  const addSection = (title: string) => {
    if (!currentProject) {
      toast.error("No project selected");
      return;
    }
    const newSection = makeNewTodoSection(title);
    setProjects(prev => prev.map(p =>
      p.id === currentProject
        ? { ...p, sections: [...p.sections, newSection] }
        : p
    ));
  };

  const toggleSectionTodoDone = (sectionIndex: number, todoIndex: number) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== currentProject) return p;

      const updatedSections = p.sections.map((section, sIdx) => {
        if (sIdx !== sectionIndex) return section;

        const updatedTodos = section.todos.map((todo, tIdx) =>
          tIdx === todoIndex ? { ...todo, done: !todo.done, updatedAt: new Date() } : todo
        );

        return {
          ...section,
          todos: updatedTodos,
          isDone: updatedTodos.every(t => t.done)
        };
      });

      return { ...p, sections: updatedSections };
    }));
  };

  const addTodoToSection = (sectionIndex: number, title: string) => {
    const newTodo = makeNewTodo(title);
    setProjects(prev => prev.map(p => {
      if (p.id !== currentProject) return p;
      return {
        ...p,
        sections: p.sections.map((s, i) => i === sectionIndex
          ? { ...s, todos: [...s.todos, newTodo], isDone: false }
          : s
        )
      };
    }));
  };

  const removeSection = (sectionIndex: number) => {
    if (!currentProject) {
      toast.error("No project selected");
      return;
    }

    setProjects(prev => prev.map(p => {
      if (p.id !== currentProject) return p;

      return {
        ...p,
        sections: p.sections.filter((_, i) => i !== sectionIndex)
      };
    }));
  };

  const removeTodoFromSection = (sectionIndex: number, todoIndex: number) => {
    if (!currentProject) return;

    setProjects(prev => prev.map(p => {
      if (p.id !== currentProject) return p;

      const updatedSections = p.sections.map((section, sIdx) => {
        if (sIdx !== sectionIndex) return section;

        const updatedTodos = section.todos.filter((_, tIdx) => tIdx !== todoIndex);

        const allTodosFinished = updatedTodos.length > 0
          ? updatedTodos.every(t => t.done)
          : section.isDone;

        return {
          ...section,
          todos: updatedTodos,
          isDone: allTodosFinished
        };
      });

      return { ...p, sections: updatedSections };
    }));
  };

  const toggleSectionDone: AppDispatch['toggleSectionDone'] = (sectionIndex: number) => {
    if (!currentProject) {
      toast.error("No project selected");
      return;
    }

    setProjects(prev => prev.map(project => {
      if (project.id !== currentProject) return project;

      const updatedSections = project.sections.map((section, index) => {
        if (index !== sectionIndex) return section;

        return {
          ...section,
          isDone: !section.isDone,
        };
      });

      return {
        ...project,
        sections: updatedSections
      };
    }));
  };

  const changeSectionTitle: AppDispatch['changeSectionTitle'] = (sectionIndex, title) => {
    if (!currentProject) {
      toast.error("No project selected");
      return;
    }

    setProjects(prev => prev.map(project => {
      if (project.id !== currentProject) return project;

      return {
        ...project,
        sections: project.sections.map((section, index) =>
          index === sectionIndex
            ? { ...section, title, updatedAt: new Date() }
            : section
        )
      };
    }));
  };

  const changeSectionTodoTitle: AppDispatch['changeSectionTodoTitle'] = (sectionIndex, todoIndex, title) => {
    if (!currentProject) {
      toast.error("No project selected");
      return;
    }

    setProjects(prev => prev.map(project => {
      if (project.id !== currentProject) return project;

      return {
        ...project,
        sections: project.sections.map((section, sIdx) => {
          if (sIdx !== sectionIndex) return section;

          return {
            ...section,
            todos: section.todos.map((todo, tIdx) =>
              tIdx === todoIndex
                ? { ...todo, title, updatedAt: new Date() }
                : todo
            ),
            updatedAt: new Date()
          };
        })
      };
    }));
  };

  return (
    <AppDispatchContext.Provider value={{
      createProject,
      removeProject,
      selectProject,
      addSection,
      addTodoToSection,
      removeSection,
      removeTodoFromSection,
      toggleSectionDone,
      toggleSectionTodoDone,
      changeSectionTitle,
      changeSectionTodoTitle
    }}>
      <AppContext.Provider value={{
        currentProject,
        projects,
        projectList,
      }}>
        {children}
      </AppContext.Provider>
    </AppDispatchContext.Provider>
  )
}