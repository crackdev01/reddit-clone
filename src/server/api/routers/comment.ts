import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const commentRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        comment: z.string().min(1),
        postId: z.number(),
        parentId: z.number(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.comment.create({
        data: {
          comment: input.comment,
          postId: input.postId,
          userId: input.userId,
          parentId: input.parentId,
        },
      });
    }),

  getList: publicProcedure
    .input(z.object({ postId: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.comment.findMany({
        relationLoadStrategy: "join",
        include: {
          Comment_Vote: true,
        },
        where: { postId: input.postId },
        orderBy: { createdAt: "desc" },
      });
    }),

  voteEvent: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        commentId: z.number(),
        type: z.number(),
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.comment_Vote.upsert({
        where: {
          id: input.id,
        },
        create: {
          userId: input.userId,
          commentId: input.commentId,
          type: input.type,
        },
        update: {
          type: input.type,
        },
      });
    }),
});
