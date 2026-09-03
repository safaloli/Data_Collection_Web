import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
  type RegisterOptions,
} from "react-hook-form";

import { cn } from "../../lib/utils";

interface InputProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<React.ComponentProps<"input">, "name"> {
  name?: FieldPath<TFieldValues>;
  control?: Control<TFieldValues>;
  rules?: RegisterOptions<TFieldValues>;
  errMsg?: string;
}

function Input<TFieldValues extends FieldValues = FieldValues>({
  className,
  type,
  name,
  control,
  rules,
  errMsg,
  ...props
}: InputProps<TFieldValues>) {

  if (control && name) {
    const { field, fieldState } = useController({
      name,
      control,
      rules,
    });

    const errorMessage = fieldState.error?.message || errMsg;

    return (
      <div className="w-full">
        <InputPrimitive
          {...field}
          {...props}
          type={type}
          value={field.value ?? ""}
          aria-invalid={fieldState.invalid}
          data-slot="input"
          className={cn(
            "h-10 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none",
            "placeholder:text-muted-foreground",
            "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
            "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
            "aria-invalid:border-destructive aria-invalid:ring-3",
            className
          )}
        />

        {errorMessage && (
          <p className="mt-1 text-sm text-destructive">
            {errorMessage}
          </p>
        )}
      </div>
    );
  }

  return (
    <InputPrimitive
      type={type}
      name={name}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none",
        "placeholder:text-muted-foreground",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
      {...props}
    />
  );
}

export { Input };