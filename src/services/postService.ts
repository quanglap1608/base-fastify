import { desc, eq } from 'drizzle-orm'
import { db } from 'src/db'
import { posts } from 'src/db/schema'

export const getPosts = async (limit: number = 10) => {
  const result = await db
    .select()
    .from(posts)    
    .orderBy(desc(posts.createdAt))
    .limit(limit)

  return result
}

export const getPostById = async (id: string) => {
  const result = await db.select().from(posts).where(eq(posts.id, id));
  return result;
};