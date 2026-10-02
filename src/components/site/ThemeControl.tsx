"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  segmentedControlItemVariants,
  segmentedControlRootClassName,
} from "@/lib/segmented-control";
import { cn } from "@/lib/utils";

type ThemeValue = "light" | "dark" | "system";

const themes = [
  { key: "system", icon: Monitor, label: "System theme" },
  { key: "light", icon: Sun, label: "Light theme" },
  { key: "dark", icon: Moon, label: "Dark theme" },
] as const satisfies readonly { key: ThemeValue; icon: typeof Monitor; label: string }[];

export type ThemeSwitcherProps = {
  value?: ThemeValue;
  onChange?: (theme: ThemeValue) => void;
  defaultValue?: ThemeValue;
  className?: string;
};

export const ThemeControl = ({
  value,
  onChange,
  defaultValue = "system",
  className,
}: ThemeSwitcherProps) => (
  <RadioGroup
    aria-label="Theme"
    className={cn(segmentedControlRootClassName, className)}
    data-slot="theme-control"
    defaultValue={defaultValue}
    onValueChange={(next) => {
      if (next === "light" || next === "dark" || next === "system") onChange?.(next);
    }}
    value={value}
  >
    {themes.map(({ key, icon: Icon, label }) => (
      <RadioGroupItem
        aria-label={label}
        className={cn(
          segmentedControlItemVariants({ size: "sm", state: "checked" }),
          // Icon-only square segment: neutralise Radio's circle/dot styling.
          "aspect-square h-8 w-8 rounded-md bg-transparent p-0 sm:h-7 sm:w-7",
          "[&_[data-slot=radio-indicator]]:hidden",
        )}
        key={key}
        value={key}
      >
        <Icon aria-hidden="true" />
      </RadioGroupItem>
    ))}
  </RadioGroup>
);

export { ThemeControl as ThemeSwitcher };
export default ThemeControl;
