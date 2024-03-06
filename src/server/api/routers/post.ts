import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const postRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.create({
        data: {
          title: input.title,
          content: input.content,
          userId: input.userId,
        },
      });
    }),

  getList: publicProcedure
    .input(z.object({ userId: z.string().optional() }))
    .query(({ ctx, input }) => {
      return ctx.db.post.findMany({
        relationLoadStrategy: "join",
        where: {
          userId: input.userId
            ? input.userId
            : {
                not: input.userId,
              },
        },
        include: {
          Post_Vote: true,
        },
        orderBy: { createdAt: "desc" },
      });
    }),

  getPost: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.post.findUnique({
        relationLoadStrategy: "join",
        where: { id: input.id },
        include: {
          Post_Vote: true,
        },
      });
    }),

  voteEvent: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        postId: z.number(),
        type: z.number(),
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post_Vote.upsert({
        where: {
          id: input.id,
        },
        update: { type: input.type },
        create: {
          userId: input.userId,
          postId: input.postId,
          type: input.type,
        },
      });
    }),
});
