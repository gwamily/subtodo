import type { TodoSection } from "@/types/section"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Edit, Plus, Trash } from "lucide-react";
import { getSectionTodoStatus } from "@/hooks/useTodoContext";
import { ButtonGroup } from "./ui/button-group";
import { GWAMCheck, GWAMIconButton } from "./GWAMStyled";
import { TodoItem } from "./TodoItem";
import { useProjectActions } from "@/hooks/useProject";
import { useState } from "react";
import { Input } from "./ui/input";
import { getRandomPlaceholder } from "@/lib/utils";

interface Props {
  section: TodoSection
  sectionIndex: number
}

export const SectionTodo: React.FC<Props> = ({ section, sectionIndex }) => {

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState<string>(section.title);

  const actions = useProjectActions();
  const status = getSectionTodoStatus(section);

  const addTodo = () => {
    actions.addTodoToSection(sectionIndex, getRandomPlaceholder())
  }

  const saveOnBlur = (title: string) => {
    actions.changeSectionTitle(sectionIndex, title);
    setIsEditing(false);
  }

  return (
    <Collapsible>
      <div className='flex items-center p-2 pr-3 gap-2 bg-paper shadow'>
        {section.todos.length <= 0 ? (
          <GWAMCheck
            checked={section.isDone} onCheckedChange={(_e) => {
              actions.toggleSectionDone(sectionIndex);
            }}
          />
        ) : (
          <GWAMCheck
            checked={section.isDone}
          />
        )}
        <CollapsibleTrigger className='w-full cursor-pointer'>
          <div className='flex items-center justify-between w-full'>
            {isEditing ? (
              <Input autoFocus value={editTitle} onChange={(e) => {
                setEditTitle(e.target.value);
              }} onBlur={() => {
                if (editTitle.trim() === "") {
                  // actions.remove(sectionIndex, todoIndex);
                }
                saveOnBlur(editTitle);
              }}
                onKeyDown={(e) => {
                  if (e.key == "Escape" || e.key == "Enter") {
                    const t = e.target as HTMLInputElement
                    t.blur();
                  }
                }}
                className="w-full "
              />
            ) : (
              <span className="flex flex-row items-center gap-2">
                {section.title}
                {status && <span>{status.done}/{status.total}</span>}
              </span>
            )}
          </div>
        </CollapsibleTrigger>
        <ButtonGroup>
          <GWAMIconButton className="bg-orange-400 hover:bg-orange-700" onClick={() => setIsEditing(true)}>
            <Edit />
          </GWAMIconButton>
          <GWAMIconButton className="w-7 h-7 bg-red-500 hover:bg-red-700" onClick={() => {
            actions.removeSection(sectionIndex)
          }}>
            <Trash />
          </GWAMIconButton>
        </ButtonGroup>
      </div >
      <CollapsibleContent className='flex flex-col w-full p-3'>
        <div className='flex flex-col gap-2'>
          {section.todos.map((todo, ti) => (
            <TodoItem key={`todo-${sectionIndex}-${ti}`} sectionIndex={sectionIndex} todo={todo} todoIndex={ti} />
          ))}
        </div>
        <GWAMIconButton gradient className='mt-2 mx-auto' onClick={addTodo}>
          <Plus />
        </GWAMIconButton>
      </CollapsibleContent>
    </Collapsible >
  )
}