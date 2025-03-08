import {
  ListboxOption as HeadlessListboxOption,
  ComboboxOption as HeadlessComboboxOption,
} from "@headlessui/react";
import { Icon } from "@iconify/react";
import clsx from "clsx";
import React from "react";

function ListboxOrComboboxOption({
  value,
  text,
  icon,
  color,
  type = "listbox",
  matchedSubstrings,
}: {
  value: string | number | Record<string, any> | null;
  text: string;
  icon?: string;
  color?: string;
  type?: "listbox" | "combobox";
  matchedSubstrings?: Array<{ length: number; offset: number }>;
}): React.ReactElement {
  const Element =
    type === "listbox" ? HeadlessListboxOption : HeadlessComboboxOption;

  const getCharClassNames = (
    matchedSubstrings: Array<{ length: number; offset: number }> | undefined,
    index: number
  ) => {
    if (
      matchedSubstrings === undefined ||
      !matchedSubstrings.some(
        ({ offset, length }) => index >= offset && index < offset + length
      )
    )
      return "";

    return "font-medium text-zinc-800 dark:text-zinc-100";
  };

  return (
    <Element
      className="flex-between w-full relative flex cursor-pointer select-none p-4 transition-all hover:bg-zinc-200 dark:hover:bg-zinc-700/50"
      value={value}
    >
      {({ selected }: { selected: boolean }) => (
        <>
          <div
            className={clsx(
              "flex items-center",
              color !== undefined ? "gap-3" : "gap-2",
              selected && "font-semibold text-zinc-800 dark:text-zinc-100"
            )}
          >
            {icon !== undefined ? (
              <span
                className={clsx("rounded-md", color ? "p-2" : "pr-2")}
                style={
                  color !== undefined
                    ? {
                        backgroundColor: color + "20",
                        color,
                      }
                    : {}
                }
              >
                <Icon className="size-5" icon={icon} />
              </span>
            ) : (
              color !== undefined && (
                <span
                  className="block size-4 rounded-full border border-zinc-200 dark:border-zinc-700"
                  style={{ backgroundColor: color }}
                />
              )
            )}
            <span>
              {text.split("").map((char, index) => (
                <span
                  key={index}
                  className={getCharClassNames(matchedSubstrings, index)}
                >
                  {char}
                </span>
              ))}
            </span>
          </div>
          {selected && (
            <Icon className="block text-lg text-lime-400" icon="tabler:check" />
          )}
        </>
      )}
    </Element>
  );
}

export default ListboxOrComboboxOption;
