import { FC, PropsWithChildren, ReactNode } from "react";
import styles from "./index.module.css";
import { UseDroppableArguments, useDroppable } from "@dnd-kit/core";
import { MenuProps } from "react-select";
import { cn } from "@/lib/utils";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Checked = DropdownMenuCheckboxItemProps["checked"];

type Variant = "default" | "solid";

type Props = {
  id: string;
  title: string;
  description?: ReactNode;
  count: number;
  data?: UseDroppableArguments["data"];
  variant?: Variant;
  //   contextMenuItems?: MenuProps["items"];
  onAddClick?: (args: { id: string }) => void;
};

export const KanbanColumn: FC<PropsWithChildren<Props>> = ({
  children,
  id,
  title,
  description,
  count,
  data,
  variant = "default",
  onAddClick,
}) => {
  const { isOver, setNodeRef, active } = useDroppable({
    id,
    data,
  });

  const onAddClickHandler = () => {
    onAddClick?.({ id });
  };

  return (
    <div ref={setNodeRef} className={cn(styles.container, styles[variant])}>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <div className={styles.title}>
            <div className="text-xl font-medium uppercase">{title}</div>
            {!!count && (
              <div className={styles.count}>
                <div className="text-xl font-medium uppercase">{count}</div>
                {/* <Text size="xs"></Text> */}
              </div>
            )}
          </div>
          <div className={styles.actionContainer}>
            {
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Open</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                  // checked={showStatusBar}
                  // onCheckedChange={setShowStatusBar}
                  >
                    Status Bar
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    // checked={showActivityBar}
                    // onCheckedChange={setShowActivityBar}
                    disabled
                  >
                    Activity Bar
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                  // checked={showPanel}
                  // onCheckedChange={setShowPanel}
                  >
                    Panel
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            }
            <Button onClick={onAddClickHandler} />
          </div>
        </div>
        {description}
      </div>
      <div
        className={cn(styles.columnScrollableContainer, {
          [styles.isOver]: isOver,
          [styles.active]: active,
        })}
      >
        <div className={cn(styles.childrenWrapper)}>{children}</div>
      </div>
    </div>
  );
};

export const KanbanColumnSkeleton: FC<
  PropsWithChildren<{ type: "deal" | "project"; variant?: Variant }>
> = ({ children, type, variant = "default" }) => {
  return (
    <div className={cn(styles.container, styles[variant])}>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <Button style={{ width: "125px" }} />
          <Button disabled />
          <Button disabled />
        </div>
        {type === "deal" && <Button style={{ width: "175px" }} />}
      </div>
      <div className={cn(styles.columnScrollableContainer)}>
        <div className={cn(styles.childrenWrapper)}>{children}</div>
      </div>
    </div>
  );
};
