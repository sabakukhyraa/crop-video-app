import React, { useState, forwardRef, useImperativeHandle, Ref } from "react";
import { View, TextInput } from "react-native";
import { z } from "zod";
import tw from "@lib/tailwind";
import ThemedText from "@components/ThemedText";
import Colors from "@constants/Colors";
import { useBoundStore } from "@store/useBoundStore";

const metadataSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().max(200, "Description cannot exceed 200 characters"),
});

export interface MetadataFormHandles {
  submit: () => { name?: string; description?: string };
}

type MetadataFormProps = {};

const MetadataForm = forwardRef<MetadataFormHandles, MetadataFormProps>(
  (props, ref: Ref<MetadataFormHandles>) => {
    const videoName = useBoundStore((state) => state.videoName);
    const videoDescription = useBoundStore((state) => state.videoDescription);
    const setVideoName = useBoundStore((state) => state.setVideoName);
    const setVideoDescription = useBoundStore(
      (state) => state.setVideoDescription
    );

    const [name, setName] = useState(videoName);
    const [description, setDescription] = useState(videoDescription);

    const [errors, setErrors] = useState<{
      name?: string;
      description?: string;
    }>({});

    const handleSubmit = () => {
      let fieldErrors: { name?: string; description?: string } = {};

      try {
        metadataSchema.parse({ name, description });
        setErrors({});

        setVideoName(name);
        setVideoDescription(description);
      } catch (err) {
        if (err instanceof z.ZodError) {
          err.issues.forEach((issue) => {
            if (issue.path[0] === "name") {
              fieldErrors.name = issue.message;
            }
            if (issue.path[0] === "description") {
              fieldErrors.description = issue.message;
            }
          });
        }
      }

      setErrors(fieldErrors);

      return fieldErrors;
    };

    useImperativeHandle(ref, () => ({
      submit: handleSubmit,
    }));

    return (
      <View style={tw`w-full`}>
        <ThemedText style={tw`mb-1`} color={Colors.lightGray}>
          Name
        </ThemedText>
        <TextInput
          style={tw.style(
            `w-full bg-midGray rounded-xl text-[16px] text-lightGray font-raleway h-13 pl-4`,
            {
              lineHeight: 18,
            }
          )}
          value={name}
          onChangeText={setName}
        />
        {errors.name && (
          <ThemedText style={tw`text-[#FF0000] mb-2`} size={14}>
            {errors.name}
          </ThemedText>
        )}

        <ThemedText style={tw`mb-1`} color={Colors.lightGray}>
          Description
        </ThemedText>
        <TextInput
          style={tw.style(
            `w-full bg-midGray rounded-xl text-[16px] text-lightGray font-raleway p-4 h-[${
              18 * 5 + 32
            }px]`,
            {
              lineHeight: 18,
            }
          )}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
        />
        {errors.description && (
          <ThemedText style={tw`text-[#FF0000] mb-2`} size={14}>
            {errors.description}
          </ThemedText>
        )}
      </View>
    );
  }
);

MetadataForm.displayName = "MetadataForm";

export default MetadataForm;
