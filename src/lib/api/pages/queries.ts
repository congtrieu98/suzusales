import { db } from "@/lib/db/index";
import { getUserAuth } from "@/lib/auth/utils";
import {
  type PageId,
  pageIdSchema,
  PageSlug,
  pageSlugSchema,
} from "@/lib/db/schema/pages";

export const getPages = async () => {
  const { session } = await getUserAuth();
  const p = await db.page.findMany({ where: { userId: session?.user.id! } });
  return { pages: p };
};

export const getPageById = async (id: PageId) => {
  const { session } = await getUserAuth();
  const { id: pageId } = pageIdSchema.parse({ id });
  const p = await db.page.findFirst({
    where: { id: pageId, userId: session?.user.id! },
  });
  return { page: p };
};

export const getPageByIdWithPageLinks = async (id: PageId) => {
  const { session } = await getUserAuth();
  const { id: pageId } = pageIdSchema.parse({ id });
  const p = await db.page.findFirst({
    where: { id: pageId, userId: session?.user.id! },
    include: { PageLink: { include: { page: true } } },
  });
  if (p === null) return { page: null };
  const { PageLink, ...page } = p;

  return { page, pageLinks: PageLink };
};

export const getPageBySlugWithPageLinks = async (slug: PageSlug) => {
  const { slug: pageSlug } = pageSlugSchema.parse({ slug });
  const p = await db.page.findFirst({
    where: { slug: pageSlug },
    include: { PageLink: { include: { page: true } } },
  });
  if (p === null) return { page: null };
  const { PageLink, ...page } = p;

  return { page, pageLinks: PageLink };
};
