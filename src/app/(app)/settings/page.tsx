"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Moon, Sun } from "lucide-react";

export default function PageSetting() {
  const { theme, setTheme } = useTheme();
  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant={"ghost"}>
            {theme === "dark" ? <Moon /> : <Sun />}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40" align="end" sideOffset={5}>
          <div
            className={`py-1 px-2 -mx-2 w-full rounded-md hover:transition-all ${
              theme === "dark" ? "hover:bg-gray-400" : "hover:bg-gray-100"
            }`}
            onClick={() => setTheme("light")}
          >
            <span className="pl-1">Light</span>
          </div>
          <div
            className={`py-1 px-2 -mx-2 w-full rounded-md hover:transition-all ${
              theme === "dark" ? "hover:bg-gray-400" : "hover:bg-gray-100"
            }`}
            onClick={() => setTheme("dark")}
          >
            <span className="pl-1">Dark</span>
          </div>
          <div
            className={`py-1 px-2 -mx-2 w-full rounded-md hover:transition-all ${
              theme === "dark" ? "hover:bg-gray-400" : "hover:bg-gray-100"
            }`}
            onClick={() => setTheme("system")}
          >
            <span className="pl-1">System</span>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
