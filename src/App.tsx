import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SectionTodo } from '@/components/TodoSection';
import { AddSectionForm } from '@/components/AddSectionForm';
import { Toaster } from "@/components/ui/sonner"
import { EmptyTodos } from '@/components/EmptyTodos';
import { TodoProjectSelector } from '@/components/TodoProjectSelector';
import { useProject } from '@/hooks/useProject';
import { useMemo } from 'react';
import { EmptyProject } from '@/components/EmptyProjects';

function App() {

  const state = useProject();

  const currentProject = useMemo(() => {
    return state.projects.find(p => p.id === state.currentProject)
  }, [state.currentProject, state.projects])

  return (
    <div className='relative flex flex-col gap-5 my-20 w-full h-full font-gwam tracking-normal'>
      <video src="/todo/gradient.webm" autoPlay loop muted className='min-w-screen min-h-screen w-auto h-auto -z-50 fixed top-0 left-0 object-fill'></video>
      <div className='mx-2 md:mx-0'>
        <Card className='bg-white max-w-200 mx-auto gap-2'>
          <CardHeader>
            <CardTitle className='flex flex-row justify-between w-full items-center'>
              <div className='flex gap-2 items-center'>
                <span>
                  GWAM TODOs
                </span>
                <TodoProjectSelector />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='w-full flex flex-col gap-2'>
              {state.currentProject && <AddSectionForm />}
              <ScrollArea className='w-full h-100 '>
                {currentProject == null ? (
                  <EmptyProject />
                ) : (
                  currentProject?.sections.length <= 0 ? (
                    <EmptyTodos />
                  ) : (
                    <div className='flex flex-col gap-2'>
                      {currentProject?.sections.map((section, si) =>
                        (<SectionTodo key={`section-${si}`} section={section} sectionIndex={si} />)
                      )}
                    </div>
                  )
                )}
              </ScrollArea>
            </div>
          </CardContent>
          <CardFooter>
            <span className='text-sm mt-5'>
              Made with ✌ and ❤️ by Pawix
            </span>
          </CardFooter>
        </Card>
      </div>
      <Toaster />
    </div>
  )
}

export default App