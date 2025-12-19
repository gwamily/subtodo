import { TodoFormSchema } from "@/types/todo";
import { useForm } from "@tanstack/react-form";
import { Field, FieldError, FieldGroup } from "./ui/field";
import { ButtonGroup } from "./ui/button-group";
import { Input } from "./ui/input";
import { Plus } from "lucide-react";
import { getRandomPlaceholder } from "@/lib/utils";
import { useCallback } from "react";
import { useProjectActions } from "@/hooks/useProject";
import { GWAMButton } from "./GWAMStyled";

export const AddSectionForm: React.FC = () => {

  const actions = useProjectActions();

  let placeholder = useCallback(() => {
    return getRandomPlaceholder();
  }, [])

  const form = useForm({
    defaultValues: {
      title: ""
    },
    validators: {
      onSubmit: TodoFormSchema
    },
    onSubmit: ({ value }) => {
      actions.addSection(value.title);
      form.reset();
    }
  });


  return (
    <div className='w-full'>
      <form onSubmit={e => {
        e.preventDefault();
        form.handleSubmit(e);
        placeholder();
      }}>
        <FieldGroup>
          <form.Field name='title'
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <ButtonGroup>
                    <Input type='text' autoComplete='off' aria-invalid={isInvalid} placeholder={placeholder()} name={field.name} value={field.state.value} onBlur={field.handleBlur} onChange={e => field.handleChange(e.target.value)} />
                    <GWAMButton variant={"outline"} gradient aria-label='Add to todo list' type='submit'>
                      <Plus color="white" />
                    </GWAMButton>
                  </ButtonGroup>
                  {isInvalid && (
                    <FieldError className='text-xs' errors={field.state.meta.errors} />
                  )}
                </Field>
              )
            }} />
        </FieldGroup>
      </form>
    </div>
  )
}