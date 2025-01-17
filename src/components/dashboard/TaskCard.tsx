import { Task } from "@prisma/client";
import React, { useTransition } from "react";
import { Checkbox } from "../ui/checkbox";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { setTaskToDone } from "@/actions/task";
import { useRouter } from "next/navigation";

interface TaskCardProps {
  task: Task;
}

function getExpirationColor(expiresAt: Date) {
  const days = Math.floor(expiresAt.getTime() - Date.now()) / 1000 / 60 / 60;

  if (days < 0) return "text-gray-500 dark text-gray-300";

  if (days <= 3 * 24) return "text-red-500 dark:text-red-400";
  if (days <= 7 * 24) return "text-orange-500 dark:text-orange-400";
  return "text-green-500 dark:text-green-400";
}

export default function TaskCard({ task }: TaskCardProps) {
  const [isLoading, startTransition] = useTransition();
  const router = useRouter();
  return (
    <div className="flex items-start">
      <Checkbox
        onCheckedChange={() => {
          startTransition(async () => {
            await setTaskToDone(task.id);
            router.refresh();
          });
        }}
        id={task.id}
        className="size-5 mr-2"
        checked={task.done}
        disabled={task.done || isLoading}
      />
      <label
        htmlFor={task.id.toString()}
        className={cn(
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed  peer-disabled:opacity-70 decoration-1 dark:decoration-white",
          task.done && "line-through"
        )}
      >
        {task.content}
        {task.expiresAt && (
          <p
            className={cn(
              "text-xs text-neutral-500 dark:text-neutral-400",
              getExpirationColor(task.expiresAt)
            )}
          >
            {format(task.expiresAt, "dd/MM/yyyy")}
          </p>
        )}
      </label>
    </div>
  );
}
