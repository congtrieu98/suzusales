"use client";

// import CustomNotificationCenter from "@/utils/hook/notifications";
import {
  NovuProvider,
  PopoverNotificationCenter,
  NotificationBell,
  IMessage,
} from "@novu/notification-center";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

function NotificationMenu() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const handleOnNotificationClick = (message: IMessage) => {
    if (message?.payload?.url) {
      if (pathname === `/consultants/${message?.payload?.url}`) {
        console.log("vao dauy");

        const spanElement = document.getElementById("mantine-r0-target");
        console.log("spanElement:", spanElement);
        console.log("spanAttr:", spanElement?.getAttribute("aria-expanded"));
        const isExpanded =
          spanElement?.getAttribute("aria-expanded") === "true";
        spanElement?.setAttribute(
          "aria-expanded",
          isExpanded ? "false" : "true"
        );

        return isExpanded;
      } else {
        router.push(`/consultants/${message?.payload?.url}` as string);
        router.refresh();
        document.addEventListener("DOMContentLoaded", function () {
          const spanElement = document.getElementById("mantine-r0-target");
          const isExpanded =
            spanElement?.getAttribute("aria-expanded") === "true";
          spanElement?.setAttribute(
            "aria-expanded",
            isExpanded ? "false" : "true"
          );
        });
      }
    }
  };

  return (
    <div className="mt-2">
      {session?.user?.id ? (
        <NovuProvider
          // backendUrl="/tasks"
          subscriberId={session?.user.id}
          applicationIdentifier={"5GtKNumdERcE"}
        >
          <PopoverNotificationCenter
            colorScheme={"light"}
            onNotificationClick={handleOnNotificationClick}
          >
            {({ unseenCount }) => (
              <NotificationBell unseenCount={unseenCount} />
            )}
          </PopoverNotificationCenter>
          {/* <CustomNotificationCenter /> */}
        </NovuProvider>
      ) : (
        ""
      )}
    </div>
  );
}

export default NotificationMenu;
