"use client";

import { useForm, Controller } from "react-hook-form";
import { Loader } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "./ui/use-toast";
import { createFormManully } from "@/app/actions/form";
import { FileIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

function CreateFormBtn() {
  const router = useRouter();
  const { control, handleSubmit } = useForm({ mode: "onBlur" });

  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(values: any) {
    try {
      setIsLoading(true);
      const formId = await createFormManully(values);
      toast({
        title: "Success",
        description: "Form created successfully",
      });
      router.push(`/builder/${formId}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong, please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          className="group border border-primary/20 h-[190px] items-center justify-center flex flex-col hover:border-primary hover:cursor-pointer border-dashed gap-4"
        >
          <FileIcon className="h-8 w-8 text-muted-foreground group-hover:text-primary" />
          <p className="font-bold text-xl text-muted-foreground group-hover:text-primary">
            Create new form
          </p>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create form</DialogTitle>
          <DialogDescription>
            Create a new form to start collecting responses
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <>
                <label className="flex w-full my-2">Name</label>
                <Input {...field} />
              </>
            )}
          />
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <>
                <label className="flex w-full my-2">Description</label>
                <Textarea rows={5} {...field} />
              </>
            )}
          />
        </form>

        <DialogFooter>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
            className="w-full mt-4"
          >
            {!isLoading && <span>Save</span>}
            {isLoading && <Loader className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateFormBtn;
