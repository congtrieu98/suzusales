import { db } from "@/lib/db/index";

export const getUsers = async () => {
    const u = await db.user.findMany({
        where: {
            email: { not: 'trieunguyen2806@gmail.com' }
        }
    })

    return { users: u }
}