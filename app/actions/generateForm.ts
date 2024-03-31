"use server";

import axios from "axios";

export async function generateForm(
  prevState: {
    message: string;
  },
  formData: FormData
) {
  const promptExplanation =
    "Based on the description, generate a survey object with 3 fields: name(string) for the form, description(string) of the form and a questions array where every element has 3 fields: label and the fieldType and fieldType can be of these options RadioGroup, Select, Input, Textarea, Switch; and return it in json format. For RadioGroup, and Select types also return fieldOptions array with label and value fields. For example, for RadioGroup, and Select types, the field options array can be [{label: 'Yes', value: 'yes'}, {label: 'No', value: 'no'}] and for Input, Textarea, and Switch types, the fieldOptions array can be empty. For example, for Input, Textarea, and Switch types, the fieldOptions array can be [] and Input should also have type and it should be either text, email, or passsord and Input should not have field options";
  const description = formData.get("description");

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `${description} ${promptExplanation}`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const responseObj = JSON.parse(response.data.choices[0].message.content);

    return {
      message: "success",
      data: responseObj,
      rowData: response.data,
    };
  } catch (e) {
    console.log({ e });
    return {
      message: "Failed to create form",
    };
  }
}
