import type { OIDCStrategy } from "remix-auth-openid";
import type { EnvLoaderData } from "./env";

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
	address: string;
	postalCode: string;
	status: number;
	position: {
		lat: number;
		lng: number;
	};
}
