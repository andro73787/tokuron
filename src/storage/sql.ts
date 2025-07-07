import { drizzle } from 'drizzle-orm/d1';
import { eq, and } from 'drizzle-orm';
import type { DBChat, DBCreateChat, DBMessage, DBCreateMessage, DBUser, DBCreateUser } from "../models/db";
import type { IDatabaseResource } from "./types";
import { chatTable, messageTable, userTable }  from "../schema";

export class UserSQLResource implements IDatabaseResource<DBUser, DBCreateUser> {
  db: ReturnType<typeof drizzle>;

  constructor(d1: D1Database) {
    this.db = drizzle(d1);
  }

  async create(data: DBCreateUser): Promise<DBUser> {
    const result = await this.db
      .insert(userTable)
      .values({ name: data.name, email: data.email, password: data.password })
      .returning()
      .get();
    return result as DBUser;
  }

  async find(data: Partial<DBUser>): Promise<DBUser | null> {
    return this.findByFields(data, false);
  }

  async findAll(data: Partial<DBUser>): Promise<DBUser[]> {
    return this.findByFields(data, true);
  }

  private async findByFields<T extends (DBUser | null) | DBUser[]>(
    data: Partial<DBUser>,
    all: boolean = false,
  ): Promise<T> {
    let query = this.db.select().from(userTable);
    const conditions = Object.entries(data)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => eq(userTable[key as keyof typeof userTable], value as string));

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    if (all) {
      const results = await query.all();
      return results as T;
    } else {
      const result = await query.get();
      return (result || null) as T;
    }
  }
}

export class ChatSQLResource implements IDatabaseResource<DBChat, DBCreateChat> {
  db: ReturnType<typeof drizzle>;
}

export class MessageSQLResource implements IDatabaseResource<DBMessage, DBCreateMessage> {
  db: ReturnType<typeof drizzle>;
}