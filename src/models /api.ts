import type {
    DBChat,
    DBCreateMessage,
    DBCreateUser,
    DBMessage,
    DBUser,
    DBCreateChat
  } from "./db";
  
  // 👤 Хэрэглэгчтэй холбоотой API төрөл
  export type APICreateUser = DBCreateUser;
  export type APIUser = Omit<DBUser, "password">;
  
  // 💬 Чаттай холбоотой API төрөл
  export type APICreateChat = DBCreateChat;
  export type APIChat = DBChat;
  
  // ✉️ Мессежтэй холбоотой API төрөл
  export type APICreateMessage = DBCreateMessage;
  export type APIMessage = DBMessage;
  