import { useState, type FormEvent } from "react"
import { Check, ChevronsUpDown, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { GWAMButton, GWAMIconButton } from "./GWAMStyled"
import { Input } from "./ui/input"
import { ButtonGroup } from "./ui/button-group"
import { useProject, useProjectActions } from "@/hooks/useProject"
import { toast } from "sonner"

export function TodoProjectSelector() {

  const [open, setOpen] = useState(false)

  const actions = useProjectActions();
  const state = useProject();

  return (
    <div className="flex gap-1 items-center">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-50 justify-between"
          >
            {state.currentProject
              ? state.projectList.find((project) => project.id === state.currentProject)?.name
              : "Select project..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-50 p-0">
          <Command>
            <CommandList>
              <CommandEmpty>No projects found</CommandEmpty>
              <CommandGroup>
                {state.projectList.map((project) => (
                  <CommandItem
                    key={project.id}
                    value={project.id}
                    onSelect={(currentValue) => {
                      actions.selectProject(currentValue === state.currentProject ? null : currentValue)
                      setOpen(false)
                    }}
                  >
                    {project.name}
                    <Check
                      className={cn(
                        "ml-auto",
                        state.currentProject === project.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <CreateNewProjectPopover />
    </div>
  )
}

export function CreateNewProjectPopover() {

  const [open, setOpen] = useState(false)
  const actions = useProjectActions();
  const [projectName, setProjectName] = useState<string>("");

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (projectName.trim().length <= 0) {
      toast.error("Project name cannot be empty");
      return;
    }

    actions.createProject(projectName.trim());
    setProjectName("");
    setOpen(false);

  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <GWAMIconButton gradient>
          <Plus />
        </GWAMIconButton>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">New project name</h4>
            <form onSubmit={submit}>
              <ButtonGroup className="w-full">
                <Input type="text" placeholder="Project name" value={projectName} onChange={e => setProjectName(e.target.value)} className="" />
                <GWAMButton gradient type="submit">
                  <Check />
                </GWAMButton>
              </ButtonGroup>
            </form>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}