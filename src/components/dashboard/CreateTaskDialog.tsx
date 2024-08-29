"use client";

import { Collection } from "@prisma/client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, SproutIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CollectionColor, CollectionColors } from "@/lib/constants";
import { useForm } from "react-hook-form";
import { CreateTaskSchema, CreateTaskSchemaType } from "@/schemas/task";
import { zodResolver } from "@hookform/resolvers/zod";

import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { createTask } from "@/actions/task";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CreateTaskDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  collection: Collection;
}

export default function CreateTaskDialog({
  open,
  setOpen,
  collection,
}: CreateTaskDialogProps) {
  const openChangeWrapper = (value: boolean) => {
    setOpen(value);
    form.reset();
  };

  const form = useForm<CreateTaskSchemaType>({
    resolver: zodResolver(CreateTaskSchema),
    defaultValues: {
      collectionId: collection.id,
    },
  });

  const router = useRouter();

  const onSubmit = async (data: CreateTaskSchemaType) => {
    try {
      await createTask(data);

      toast.success("Task created");
      openChangeWrapper(false);
      // refresh page
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={openChangeWrapper}>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex-gap-2">
            Add task to collection:
            <span
              className={cn(
                "p-[1px] bg-clip-text text-transparent",
                CollectionColors[collection.color as CollectionColor]
              )}
            >
              {collection.name}
            </span>
          </DialogTitle>
          <DialogDescription>
            Add a task to your collection. You can add as many tasks as you want
            too.
          </DialogDescription>
        </DialogHeader>
        <div className="gap-4 py-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 w-full"
            >
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={5}
                        placeholder="Task content here"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Collection name</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expiresAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expires At</FormLabel>
                    <FormControl></FormControl>
                    <FormDescription>
                      When should this task expire
                    </FormDescription>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value && format(field.value, "do MMMM, yyy")}
                            {!field.value && <span>No expiration</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button
            disabled={form.formState.isSubmitting}
            className={cn(
              "w-full dark:text-white text-white",
              CollectionColors[collection.color as CollectionColor]
            )}
            onClick={form.handleSubmit(onSubmit)}
          >
            Confirm
            {form.formState.isSubmitting && (
              <SproutIcon className="ml-2 size-4 animate-spin" />
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
