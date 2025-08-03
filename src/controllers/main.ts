import { Hono } from "hono";
import { cors } from "hono/cors";
import type { ContextVariables } from "../constants";
import { API_PREFIX, CLIENT_ORIGIN } from "../constants";
import { attachUserId, checkJWTAuth } from "../middlewares/auth";
import { AUTH_PREFIX, createAuthApp } from "./auth";
import { CHAT_PREFIX, createChatApp } from "./chat";
import { env } from 'cloudflare:workers'
import { UserSQLResource, ChatSQLResource, MessageSQLResource } from "../storage/sql";

export function createMainApp(
    authApp: Hono<ContextVariables>,
    chatApp: Hono<ContextVariables>,
  ) {
    const app = new Hono<ContextVariables>().basePath(API_PREFIX);
    app.use("*", cors({origin: CLIENT_ORIGIN}));
    app.options('*', (c) => {
      return c.json({}, {
        headers: {
          'Access-Control-Allow-Origin': CLIENT_ORIGIN,
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      })
    });
    app.use("*", checkJWTAuth);
    app.use("*", attachUserId);
    app.route(AUTH_PREFIX, authApp);
    app.route(CHAT_PREFIX, chatApp);
  
    return app;
  }
  export function createSQLApp () { 
    const authApp = createAuthApp(new UserSQLResource(env.DB));
    const chatApp = createChatApp(
      new ChatSQLResource(env.DB),
      new MessageSQLResource(env.DB)
    );
  
    return createMainApp(authApp, chatApp);
  }
//export function createInMemoryApp() {
  // return createMainApp(
   // createAuthApp(new SimpleInMemoryResource<DBUser, DBCreateUser>()),
   //createChatApp(
   // new SimpleInMemoryResource<DBChat, DBCreateChat>(),
   // new SimpleInMemoryResource<DBMessage, DBCreateMessage> (),
      
 //)
 //);
 // }