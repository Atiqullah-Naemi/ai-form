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
import { useEdgeStore } from "@/lib/edgestore";
import { Form } from "../ui/form";
import { create } from "zustand";

interface FileProps {
  file: File | null;
  setFile: (file: File) => void;
}

const useFileUpload = create<FileProps>((set) => ({
  file: null,
  setFile: (file) => set({ file }),
}));

const type: ElementsType = "ImageField";

const extraAttributes = {
  label: "Image field",
  helperText: "Helper text",
  required: false,
  imageUrl: "",
};

const DesignerComponent = memo(function DesignerComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
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
      {imageUrl && (
        <div className="relative w-[100px]  h-[100px]">
          <Image
            className="h-full w-full rounded-md object-cover"
            src={imageUrl as string}
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
      {imageUrl && (
        <div className="relative w-[100px]  h-[100px]">
          <Image
            className="h-full w-full rounded-md object-cover"
            src={imageUrl as string}
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
  const { edgestore } = useEdgeStore();

  const element = elementInstance as CustomInstance;
  const { updateElement } = useDesigner();
  const form = useForm({
    mode: "onBlur",
    defaultValues: {
      imageUrl: element.extraAttributes.imageUrl,
    },
  });

  function applyChanges(values: any) {
    const { imageUrl } = values;
    updateElement(element.id, {
      ...element,
      extraAttributes: {
        imageUrl,
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
        <>
          <SingleImageDropzone
            width={200}
            height={200}
            value={file as File}
            onChange={(file: any) => {
              setFile(file);
            }}
          />

          <button
            onClick={async () => {
              if (file) {
                const res = await edgestore.publicFiles.upload({
                  file,
                  onProgressChange: (progress) => {
                    // you can use this to show a progress bar
                    console.log(progress);
                  },
                });
                // you can run some server action or api here
                // to add the necessary data to your database
                console.log(res);
              }
            }}
          >
            Upload
          </button>
        </>
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
