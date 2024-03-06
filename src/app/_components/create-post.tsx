"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

import { api } from "@/trpc/react";
import { User } from "@/types/user.type";

const FormSchema = z.object({
  title: z.string().min(1, "* This field is required!"),
  content: z.string(),
});

interface Props {
  user: User;
}

export const CreatePost: React.FC<Props> = ({ user }) => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const createPost = api.post.create.useMutation({
    onSuccess: () => {
      toast({
        title: "New Post",
        description: "Successful!",
      });
      router.refresh();
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const reqData = {
      ...data,
      userId: user.id,
    };
    createPost.mutate(reqData);
  }

  return (
    <div className="flex gap-4 rounded-[12px] border border-gray-200 px-4 pb-3 pt-4">
      <div className="w-[24px]">
        <Image
          className="rounded-full"
          src={user.imageUrl}
          alt={`${user.firstName} ${user.lastName}`}
          width={24}
          height={24}
        />
      </div>
      <div className="w-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-3"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      data-test-id="title"
                      placeholder="Title of your post"
                      {...field}
                      className="border-0 text-base font-normal text-gray-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      data-test-id="content"
                      rows={1}
                      placeholder="Share your thoughts with the world!"
                      {...field}
                      className="resize-none border-0 border-b border-gray-200 text-base font-normal text-gray-500"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              data-test-id="post-submit"
              className="h-[36px] self-end rounded-[10px] bg-indigo-500 px-3 py-2 text-white hover:bg-indigo-600"
              type="submit"
            >
              Post
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
