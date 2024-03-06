"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { getHourBetweenDate } from "@/lib/utils";
import { api } from "@/trpc/react";

import { Post, Post_Vote } from "@prisma/client";
import { User } from "@/types/user.type";

import {
  ArrowDownSvg,
  ArrowUpSvg,
  ArrowDownActiveSvg,
  ArrowUpActiveSvg,
} from "@/app/_assets/svg";

interface Props {
  item: Post;
  users: User[];
  voteList: Post_Vote[];
  userId?: string;
}

export const PostItem: React.FC<Props> = ({
  item,
  users,
  voteList,
  userId,
}) => {
  const router = useRouter();
  const voteEvent = api.post.voteEvent.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const existingVote = voteList.find(
    (vote) => vote.userId === userId && vote.postId === item.id,
  );

  const handleVote = (type: number) => {
    if (userId) {
      const reqData = {
        type,
        postId: item.id,
        userId: userId,
        id: existingVote ? existingVote.id : 0,
      };
      voteEvent.mutate(reqData);
    }
  };

  const voteUpCount = voteList.filter(
    (vote) => vote.postId === item.id && vote.type === 1,
  ).length;
  const voteDownCount = voteList.filter(
    (vote) => vote.postId === item.id && vote.type === 0,
  ).length;

  const postAuthor = users.find((u) => u.id === item.userId);

  return (
    <div className="flex gap-4" data-test-id="post-list">
      <div className="flex flex-col items-center justify-between">
        <button
          disabled={userId === item.userId ? true : false}
          onClick={() => handleVote(1)}
          className="flex h-[20px] w-[20px] cursor-pointer items-center justify-center"
        >
          <Image
            src={
              existingVote && existingVote.type === 1
                ? ArrowUpActiveSvg
                : ArrowUpSvg
            }
            alt="vote up"
            width={20}
            height={20}
          />
        </button>
        <p className="text-base font-medium text-gray-800">
          {voteUpCount - voteDownCount}
        </p>
        <button
          disabled={userId === item.userId ? true : false}
          onClick={() => handleVote(0)}
          className="flex h-[20px] w-[20px] cursor-pointer items-center justify-center"
        >
          <Image
            src={
              existingVote && existingVote.type === 0
                ? ArrowDownActiveSvg
                : ArrowDownSvg
            }
            alt="vote down"
            width={20}
            height={20}
          />
        </button>
      </div>
      <div className="flex flex-col gap-[6px]">
        <div className="flex items-center gap-2">
          {postAuthor && (
            <div>
              <Image
                className="rounded-full"
                src={postAuthor.imageUrl}
                alt={`${postAuthor.firstName} ${postAuthor.lastName}`}
                width={24}
                height={24}
              />
            </div>
          )}
          <p className="text-sm font-normal text-gray-600">
            {`Posted by ${postAuthor ? `${postAuthor.firstName} ${postAuthor.lastName}` : ""} ${getHourBetweenDate(item.createdAt, new Date())}`}
          </p>
        </div>
        <h5 className="text-base font-medium text-gray-900">
          <Link href={`/viewpost/${item.id}`}>{item.title}</Link>
        </h5>
        <p className="w-[560px] overflow-hidden text-ellipsis text-nowrap text-sm font-normal text-gray-700">
          {item.content}
        </p>
      </div>
    </div>
  );
};
