import { CreateComment } from "@/app/_components/create-comment";
import { PostItem } from "@/app/_components/post-item";
import { CommentItem } from "@/app/_components/comment-item";
import { BackLink } from "@/app/_components/back-link";
import { api } from "@/trpc/server";
import { Comment_Vote } from "@prisma/client";
import { SignedIn, auth, clerkClient } from "@clerk/nextjs";
import { User } from "@/types/user.type";

const getData = async (id: number) => {
  const post = await api.post.getPost.query({
    id: Number(id),
  });
  const commentList = await api.comment.getList.query({
    postId: Number(id),
  });

  const userList = await clerkClient.users.getUserList();

  const users: User[] = userList.map((user) => ({
    id: user.id,
    imageUrl: user.imageUrl,
    firstName: user.firstName,
    lastName: user.lastName,
  }));

  const { userId } = auth();
  const user = users.find((user) => user.id === userId);

  return { post, users, user, commentList };
};

interface Item {
  id: number;
  comment: string;
  postId: number;
  userId: string;
  parentId: number;
  createdAt: Date;
  updatedAt: Date;
  Comment_Vote: Comment_Vote[];
  children?: Item[];
}

function buildTree(items: Item[], parentId = 0) {
  const tree: Item[] = [];
  items.forEach((item) => {
    if (item.parentId === parentId) {
      const children = buildTree(items, item.id);
      if (children.length) {
        item.children = children;
      }
      tree.push(item);
    }
  });
  return tree;
}

const ViewPost = async ({ params }: { params: { id: number } }) => {
  const { post, users, user, commentList } = await getData(params.id);

  const TreeItem = ({ item }: { item: Item }) => {
    return (
      <div className="flex flex-col gap-[16px]">
        <CommentItem
          item={item}
          users={users}
          voteList={item.Comment_Vote}
          user={user ? user : ({} as User)}
        />
        {item.children && (
          <div className="ml-8 flex flex-col gap-[16px]">
            {item.children.map((child) => (
              <TreeItem key={child.id} item={child} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-[24px]">
      <BackLink />
      {post && (
        <PostItem
          item={post}
          users={users}
          voteList={post.Post_Vote}
          userId={user?.id}
        />
      )}
      <SignedIn>
        {post && user && post.userId !== user.id && (
          <CreateComment user={user} postId={params.id} parentId={0} />
        )}
      </SignedIn>

      <div>
        <div className="border-t border-gray-200 pt-[24px]">
          <h5 className="text-medium text-sm text-gray-800">All comments</h5>
        </div>
        <div className="divide-y divide-gray-200">
          {commentList.length > 0 ? (
            buildTree(commentList).map((item) => (
              <div className="py-[24px]" key={item.id}>
                <TreeItem item={item} />
              </div>
            ))
          ) : (
            <div className="text-center text-base text-gray-500">
              There is no comments!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewPost;
