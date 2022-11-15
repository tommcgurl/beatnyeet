This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
yarn dev 
```
> This will install the deps you need, run the database migrations using Prisma, and seed the database with some intial mock data.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Explore the data in Prisma Studio
Prisma comes with a built-in GUI to view and edit the data in your database. You can open it using the following command:
```bash
npx prisma studio
```
![prismastudio](https://user-images.githubusercontent.com/5060039/201525971-b0686f1b-a260-49ed-b3b4-bb236a29a75e.gif)

## API
The API routes were auto generated from our prisma schema using [Next-Crud](https://next-crud.js.org/)

You can see the available endpoints by visiting [the open api spec (localhost:3000/api/docs)](http://localhost:3000/api/docs) when running the server locally.

You can easily import this into Postman to save as a collection.
![postman](https://user-images.githubusercontent.com/5060039/201816097-16045d3a-9813-49ff-8b0f-8e35ee97bdd4.gif)


## NextJS 
You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
