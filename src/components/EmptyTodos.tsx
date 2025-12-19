import { LayoutList } from "lucide-react"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { GWAMButton } from "./GWAMStyled"

export function EmptyTodos() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <LayoutList />
        </EmptyMedia>
        <EmptyTitle>No Todos Yet</EmptyTitle>
        <EmptyDescription>
          You have not added any todos. Start by adding your first todo or importing from a file.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <GWAMButton gradient disabled>Import Todos from file (soon)</GWAMButton>
        </div>
      </EmptyContent>
    </Empty>
  )
}
