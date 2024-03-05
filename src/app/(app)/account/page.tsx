import SignIn from "@/components/auth/SignIn";
import UserSettings from "./UserSettings";
import { checkAuth, getUserAuth } from "@/lib/auth/utils";

export default async function Account() {
  await checkAuth();
  const { session } = await getUserAuth();

  return (
    <main>
      <h1 className="text-2xl font-semibold my-4">Account</h1>
      <div className="space-y-4">
        <UserSettings session={session} />
        <div className="flex justify-between">
          <div></div>
          <div className="items-end">
            <SignIn />
          </div>
        </div>
      </div>
    </main>
  );
}
