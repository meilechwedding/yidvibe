"use client";

import { Children, cloneElement, isValidElement, useId, type ReactElement, type ReactNode } from "react";
import { Check } from "lucide-react";

/** Associates one control with its label, or names a group of controls. */
export function FormField({ label, children, required, hint, error, fromProfile }: {
  label: string;
  children: ReactNode;
  required?: boolean;
  hint?: string;
  error?: string;
  fromProfile?: boolean;
}) {
  const id = useId();
  const content = Children.toArray(children);
  const controls = content.filter((child) =>
    isValidElement(child) && ["input", "select", "textarea"].includes(String(child.type)) &&
    (child.props as { type?: string }).type !== "hidden",
  ) as ReactElement<{ id?: string; "aria-describedby"?: string }>[];
  const single = controls.length === 1 ? controls[0] : null;
  const controlId = single?.props.id ?? `${id}-control`;
  return (
    <div role={single ? undefined : "group"} aria-labelledby={single ? undefined : `${id}-label`}>
      <label id={`${id}-label`} htmlFor={single ? controlId : undefined} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
        {required && <span aria-hidden="true" className="ml-0.5 text-clay-mid">*</span>}
        {hint && <span className="ml-2 text-xs font-normal text-muted-foreground">{hint}</span>}
        {fromProfile && <span className="ml-2 inline-flex items-center gap-1 align-middle text-[11px] font-normal text-sage-deep"><Check size={12} /> from profile</span>}
      </label>
      {content.map((child) => single && child === single ? cloneElement(single, {
        id: controlId,
        "aria-describedby": [single.props["aria-describedby"], error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined,
        ...{ "aria-invalid": error ? true : undefined, "aria-required": required ? true : undefined },
      }) : child)}
      {error && <p id={`${id}-error`} className="mt-1 text-xs text-clay-deep">{error}</p>}
    </div>
  );
}
