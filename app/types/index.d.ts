import { EnvLoaderData } from "./env";
import { User } from "~/service/auth/auth.server";
import { OIDCStrategy } from "remix-auth-openid";

export interface User extends OIDCStrategy.BaseUser {
	sub: string;
  name: string;
  email: string;
}

export interface RootLoaderData {
	ENV: EnvLoaderData;
	USER?: User;
}

export interface Client {
	id: number;
	name: string;
}
