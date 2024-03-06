import { clerkClient, auth } from "@clerk/nextjs";
import { api } from "@/trpc/server";
import { User } from "@/types/user.type";
import { PostItem } from "@/app/_components/post-item";

const getData = async () => {
  const { userId } = auth();

  const postList = await api.post.getList.query({
    userId: userId ? userId : "",
  });
  const userList = await clerkClient.users.getUserList();

  const users: User[] = userList.map((user) => ({
    id: user.id,
    imageUrl: user.imageUrl,
    firstName: user.firstName,
    lastName: user.lastName,
  }));

  const user = users.find((user) => user.id === userId);

  return { postList, users, user };
};

const MyPost = async () => {
  const { postList, users, user } = await getData();

  return (
    <div className="w-[600px]">
      <div className="flex flex-col divide-y divide-gray-200">
        {postList.length > 0 ? (
          postList.map((item) => (
            <div className={`pb-10 pt-10 first:pt-0`} key={item.id}>
              <PostItem
                key={item.id}
                item={item}
                users={users}
                voteList={item.Post_Vote}
                userId={user?.id}
              />
            </div>
          ))
        ) : (
          <div className="text-center text-base text-gray-500">
            There is no post!
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPost;
