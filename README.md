# Test Project

This project is a basic clone of Reddit, designed to demonstrate a full-stack application using a modern development stack. It allows users to read posts, create posts, comment on posts, and vote on posts and comments, with certain actions restricted to authenticated users.

## Technologies Used

- **Frontend**: Next.js, Tailwind CSS, `shadcn/ui` for UI components
- **Backend**: tRPC for the backend architecture
- **Database**: Prisma as the ORM with PlanetScale as the database service
- **Authentication**: Clerk for user management and authentication
- **Starter Kit**: create t3 app

## Features

- **Reading Posts**: Available to all users, including those not logged in.
- **Creating Posts**: Restricted to logged-in users.
- **Commenting**: Logged-in users can comment on posts and other comments.
- **Voting System**: Authenticated users can upvote or downvote posts and comments.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v21.4.0)
- yarn
- A PlanetScale account and a database setup
- A Clerk account for handling authentication

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourgithubusername/reddit-clone.git
cd reddit-clone
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Set up environment variables**

Create a `.env` file in the root of your project and add the following variables:

```env
DATABASE_URL='mysql://YOUR_MYSQL_URL_HERE?sslaccept=strict'
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

4. **Run the Prisma migration (optional)**

If you've defined new models or changed existing ones, you might need to run a migration:

```bash
yarn db:push
```

5. **Start the development server**

```bash
yarn dev
```

6. **Test the development server**

### Environment for testing

cypress.env.json
```env
{
  "test_email": "your registered email",
  "test_password": "password"
}
```

```bash
yarn cypress:open
```


Navigate to `http://localhost:3000` to view the app.

