import { createCookie, createMemorySessionStorage } from "react-router";

const sessionUserKey = "user";

const sessionCookie = createCookie(process.env.AUTHENTICATOR_STRATEGY ?? "", {
	secrets: ["some-secret-for-signing-cookies"],
	sameSite: "lax",
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	maxAge: 60 * 60 * 1,
});

export const sessionStorage = createMemorySessionStorage({
	cookie: sessionCookie,
});

export const getSession = async <User>(request: Request): Promise<User> => {
	const session = await sessionStorage.getSession(
		request.headers.get("Cookie"),
	);
	return session.get(sessionUserKey);
};

export const setSession = async <User>(request: Request, user: User) => {
	const session = await sessionStorage.getSession(
		request.headers.get("Cookie"),
	);
	session.set(sessionUserKey, user);

	return new Headers({
		"Set-Cookie": await sessionStorage.commitSession(session),
	});
};

export const clearSession = async (request: Request) => {
	const session = await sessionStorage.getSession(
		request.headers.get("Cookie"),
	);
	return new Headers({
		"Set-Cookie": await sessionStorage.destroySession(session),
	});
};
