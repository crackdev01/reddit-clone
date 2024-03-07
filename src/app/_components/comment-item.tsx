"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/trpc/react";

import { getHourBetweenDate } from "@/lib/utils";
import { Comment, Comment_Vote } from "@prisma/client";
import { User } from "@/types/user.type";
import { CreateComment } from "./create-comment";

import {
  ArrowDownSvg,
  ArrowDownActiveSvg,
  ArrowUpSvg,
  ArrowUpActiveSvg,
  CommentSvg,
  CommentActiveSvg,
} from "@/app/_assets/svg";

interface Props {
  item: Comment;
  users: User[];
  voteList: Comment_Vote[];
  user: User;
}

export const CommentItem: React.FC<Props> = ({
  item,
  users,
  user,
  voteList,
}) => {
  const router = useRouter();
  const [openReply, setOpenReply] = useState<boolean>(false);

  const existingVote = voteList.find(
    (vote) => vote.userId === user.id && vote.commentId === item.id,
  );

  const voteEvent = api.comment.voteEvent.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const onVoteHandler = (type: number) => {
    if (user.id) {
      const reqData = {
        type,
        id: existingVote ? existingVote.id : 0,
        commentId: item.id,
        userId: user.id,
      };
      voteEvent.mutate(reqData);
    }
  };

  const onReply = () => {
    setOpenReply(!openReply);
  };

  const voteUpCount = voteList.filter(
    (vote) => vote.commentId === item.id && vote.type === 1,
  ).length;
  const voteDownCount = voteList.filter(
    (vote) => vote.commentId === item.id && vote.type === 0,
  ).length;

  const commentAuthor = users.find((u) => u.id === item.userId);

  return (
    <div className="flex flex-col gap-[12px]">
      <div className="flex items-center gap-2">
        {commentAuthor && (
          <div>
            <Image
              className="rounded-full"
              src={commentAuthor.imageUrl}
              alt={`${commentAuthor.firstName} ${commentAuthor.lastName}`}
              width={24}
              height={24}
            />
          </div>
        )}
        <p className="text-sm font-normal text-gray-600">
          {`Posted by ${commentAuthor ? `${commentAuthor.firstName} ${commentAuthor.lastName}` : ""} ${getHourBetweenDate(item.createdAt, new Date())}`}
        </p>
      </div>
      <p className="text-sm font-normal text-gray-700">{item.comment}</p>
      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <button
            disabled={user.id === item.userId ? true : false}
            onClick={() => onVoteHandler(1)}
            className="flex h-[20px] w-[20px] cursor-pointer items-center justify-center"
          >
            <Image
              src={
                existingVote && existingVote.type === 1
                  ? ArrowUpActiveSvg
                  : ArrowUpSvg
              }
              alt="vote up"
            />
          </button>
          <p className="text-sm font-medium text-gray-700">
            {voteUpCount - voteDownCount}
          </p>
          <button
            disabled={user.id === item.userId ? true : false}
            onClick={() => onVoteHandler(0)}
            className="flex h-[20px] w-[20px] cursor-pointer items-center justify-center"
          >
            <Image
              src={
                existingVote && existingVote.type === 0
                  ? ArrowDownActiveSvg
                  : ArrowDownSvg
              }
              alt="vote down"
            />
          </button>
        </div>
        <div>
          <button
            disabled={item.userId === user.id}
            onClick={onReply}
            className={`flex gap-2 text-sm font-medium  ${openReply ? "text-indigo-600" : "text-gray-700"}`}
          >
            <Image
              src={openReply ? CommentActiveSvg : CommentSvg}
              alt="Reply"
            />{" "}
            Reply
          </button>
        </div>
      </div>
      {openReply && (
        <CreateComment user={user} parentId={item.id} postId={item.postId} />
      )}
    </div>
  );
};
