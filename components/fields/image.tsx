"use client";

import { ImageIcon } from "lucide-react";
import {
  ElementsType,
  FormElement,
  FormElementInstance,
} from "../form-elements";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { memo, useMemo } from "react";
import useDesigner from "../../hooks/useDesigner";
import { SingleImageDropzone } from "@/components/single-image-dropzone";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { create } from "zustand";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";

interface FileProps {
  file: File | null;
  setFile: (file: File) => void;
}

export const useFileUpload = create<FileProps>((set) => ({
  file: null,
  setFile: (file) => set({ file }),
}));

const type: ElementsType = "ImageField";

const extraAttributes = {
  label: "Image field",
  helperText: "Helper text",
  required: false,
  image: { url: "", height: 0 },
};

const DesignerComponent = memo(function DesignerComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;
  const { image } = element.extraAttributes;

  const { file } = useFileUpload();

  const imageUrl = useMemo(() => {
    if (typeof file === "string") {
      // in case a url is passed in, use it to display the image
      return file;
    } else if (file) {
      // in case a file is passed in, create a base64 url to display the image
      return URL.createObjectURL(file);
    }
    return null;
  }, [file]);

  return (
    <div className="flex flex-col gap-2 w-full asdfasdfasdfasfs">
      {(imageUrl || image.url) && (
        <div className="relative w-[100px]  h-[100px]">
          <Image
            className="h-full w-full rounded-md object-cover"
            src={(imageUrl as string) || (image.url as string)}
            alt="image"
            fill
          />
        </div>
      )}
    </div>
  );
});

function FormComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;
  const { image } = element.extraAttributes;

  const { file } = useFileUpload();

  const imageUrl = useMemo(() => {
    if (typeof file === "string") {
      // in case a url is passed in, use it to display the image
      return file;
    } else if (file) {
      // in case a file is passed in, create a base64 url to display the image
      return URL.createObjectURL(file);
    }
    return null;
  }, [file]);

  return (
    <div className="flex flex-col gap-2 w-full">
      {(imageUrl || image.url) && (
        <div
          className={cn("relative w-full")}
          style={{
            height: image.height ? `${image.height}px` : "100px",
          }}
        >
          <Image
            className="h-full w-full rounded-md object-cover"
            src={(imageUrl as string) || (image.url as string)}
            alt="image"
            fill
          />
        </div>
      )}
    </div>
  );
}

function PropertiesComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const { file, setFile } = useFileUpload();

  const element = elementInstance as CustomInstance;
  const { updateElement } = useDesigner();
  const form = useForm({
    mode: "onBlur",
    defaultValues: {
      image: {
        height: element.extraAttributes.image.height,
        url: element.extraAttributes.image.url,
      },
    },
  });

  function applyChanges(values: any) {
    const { image } = values;
    updateElement(element.id, {
      ...element,
      extraAttributes: {
        ...element.extraAttributes,
        image: { height: image.height, url: image.url },
      },
    });
  }

  return (
    <Form {...form}>
      <form
        onBlur={form.handleSubmit(applyChanges)}
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="space-y-3"
      >
        <SingleImageDropzone
          width={200}
          height={200}
          value={file as File}
          onChange={(file: any) => {
            setFile(file);
          }}
        />
        <FormField
          control={form.control}
          name="image.height"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Height</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

export const ImageFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon: ImageIcon,
    label: "Image Field",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,

  validate: () => true,
};

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};
