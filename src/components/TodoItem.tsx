import type { Todo } from "@/types/todo"
import { GWAMCheck, GWAMIconButton } from "./GWAMStyled"
import { ButtonGroup } from "./ui/button-group"
import { cn } from "@/lib/utils"
import { Edit, Trash } from "lucide-react"
import { useEffect, useState } from "react"
import { Input } from "./ui/input"
import { useProjectActions } from "@/hooks/useProject"

interface Props {
  todo: Todo
  sectionIndex: number
  todoIndex: number
  autoEdit?: boolean
  onAutoEditConsumed?: () => void
}

export const TodoItem: React.FC<Props> = ({ todo, sectionIndex, todoIndex, autoEdit = false, onAutoEditConsumed }) => {

  const actions = useProjectActions();
  const [editTitle, setEditTitle] = useState<string>(todo.title);

  const [isEditing, setIsEditing] = useState(autoEdit);

  useEffect(() => {
    if (autoEdit) {
      setIsEditing(true);
      onAutoEditConsumed?.();
    }
  }, [autoEdit, onAutoEditConsumed]);

  const saveOnBlur = (title: string) => {
    actions.changeSectionTodoTitle(sectionIndex, todoIndex, title);
    setIsEditing(false);
  }

  return (
    <div key={todo.id} className='flex flex-row items-center shadow gap-2 bg-paper p-2'>
      <GWAMCheck
        checked={todo.done} onCheckedChange={(_e) => {
          actions.toggleSectionTodoDone(sectionIndex, todoIndex)
        }} />
      <span className={cn("w-full")}>
        {isEditing ? (
          <Input autoFocus value={editTitle} onChange={(e) => {
            setEditTitle(e.target.value);
          }} onBlur={() => {
            if (editTitle.trim() === "") {
              actions.removeTodoFromSection(sectionIndex, todoIndex);
              return
            }
            saveOnBlur(editTitle);
          }}
            onFocus={(e) => {
              if (autoEdit) {
                e.target.select();
              }
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
          <span>
            {todo.title}
          </span>

        )}
      </span>
      <ButtonGroup className='ml-auto hover:cursor-pointer'>
        <GWAMIconButton className="bg-orange-400 hover:bg-orange-700" onClick={() => setIsEditing(true)}>
          <Edit />
        </GWAMIconButton>
        <GWAMIconButton className="bg-red-500 hover:bg-red-700" onClick={() => actions.removeTodoFromSection(sectionIndex, todoIndex)}>
          <Trash />
        </GWAMIconButton>
      </ButtonGroup>
    </div>
  )
}