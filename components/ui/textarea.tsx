import * as React from "react"
import { cn } from "cn"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-[4px] border border-[#27272A] bg-[#0A0A0A] px-3 py-2 text-sm text-white transition-colors outline-none placeholder:text-nt-secondary focus-visible:border-white focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-nt-red",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
