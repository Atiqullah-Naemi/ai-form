"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { generateForm } from "@/app/actions/form";
import { useFormState, useFormStatus } from "react-dom";

import { FileIcon, Loader, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {};

const initialState: {
  message: string;
  data?: any;
} = {
  message: "",
};

export function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader className="animate-spin" /> : "Generate"}
    </Button>
  );
}

const FormGenerator = (props: Props) => {
  const router = useRouter();
  const [state, formAction] = useFormState(generateForm, initialState);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (state.message === "success") {
      setOpen(false);
      router.refresh();
      router.push("/");
    }
  }, [router, state.message]);

  const onFormCreate = () => {
    setOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        onClick={onFormCreate}
        variant={"outline"}
        className="group border border-primary/20 h-[190px] items-center justify-center flex flex-col hover:border-primary hover:cursor-pointer border-dashed gap-4"
      >
        <FileIcon className="h-8 w-8 text-muted-foreground group-hover:text-primary" />
        <p className="font-bold text-xl text-muted-foreground group-hover:text-primary">
          Create new form
        </p>
      </Button>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Form</DialogTitle>
        </DialogHeader>
        <form action={formAction}>
          <div className="grid gap-4 py-4">
            <Textarea
              id="description"
              name="description"
              required
              placeholder="Share what your form is about, who is it for, and what information you would like to collect. And AI will do the magic ✨"
            />
          </div>
          <DialogFooter>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FormGenerator;
