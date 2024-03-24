import { getUserAuth } from "@/lib/auth/utils";

export default async function Home() {
  const { session } = await getUserAuth();
  return (
    <main className="space-y-4">
      {session ? (
        <h1 className="text-2xl text-center font-semibold">
          Welcom to {session.user.name}
        </h1>
      ) : null}
    </main>
  );
}
