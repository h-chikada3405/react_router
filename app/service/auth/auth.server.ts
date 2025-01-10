import { redirect } from "react-router";
import { Authenticator } from "remix-auth";
import { OIDCStrategy } from "remix-auth-openid";
import { getSession, setSession } from "./session.server";
import { User } from "~/types";

/**
 * OIDC認証を処理し、ユーザーセッションを管理
 *
 * @example
 * return await authenticator.authenticate(
 * 	process.env.AUTHENTICATOR_STRATEGY ?? "",
 * 	request,
 * );
 */
let authenticator = new Authenticator<User>();

/**
 * OIDC認証戦略を設定
 *
 * @param {string} issuer - OIDCプロバイダーのURL
 * @param {string} client_id - OIDCクライアントID
 * @param {string} client_secret - OIDCクライアントシークレット
 * @param {string[]} redirect_uris - 認証後にリダイレクトされるURIのリスト
 * @param {string[]} scopes - リクエストするスコープのリスト
 * @param {string} id_token_signed_response_alg - IDトークンの署名アルゴリズム
 */
const strategy = await OIDCStrategy.init<User>({
	issuer: process.env.OIDC_ISSUER ?? "",
	client_id: process.env.OIDC_CLIENT_ID ?? "",
	client_secret: process.env.OIDC_CLIENT_SECRET ?? "",
	redirect_uris: (process.env.OIDC_REDIRECT_URIS ?? "").split(","),
	scopes: (process.env.OIDC_SCOPES ?? "").split(","),
	id_token_signed_response_alg: process.env.OIDC_ID_TOKEN_ALG ?? "RS256",
}, async ({ tokens }): Promise<User> => {
	if (!tokens.id_token) {
		throw new Error("No id_token in response");
	}

	if (!tokens.access_token) {
		throw new Error("No access_token in response");
	}

	return {
		sub: tokens.claims().sub ?? "",
		name: tokens.claims().name ?? "",
		email: tokens.claims().email ?? "",
		accessToken: tokens.access_token,
		idToken: tokens.id_token,
		expiredAt: new Date().getTime() / 1000 + (tokens.expires_in ?? 0),
	};
})

authenticator.use(strategy, process.env.AUTHENTICATOR_STRATEGY ?? "");

/**
 * リクエストからユーザーセッションを取得
 *
 * @param {Request} request
 * @returns {Promise<User>}
 */
async function getUserSession(request:Request): Promise<User> {
	const user = await getSession<User>(request);
	if (!user) {
		try {
			const user = await authenticator.authenticate(process.env.AUTHENTICATOR_STRATEGY ?? "", request);
			const headers = await setSession(request, user);
			throw redirect("/", { headers: headers });
		} catch(error) {
			if (error instanceof Response) {
				throw error;
			}
			console.error(error)
			throw redirect("/auth/login");
		}
	}
	return user;
}

export { authenticator, getUserSession };
