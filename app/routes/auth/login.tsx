import type { LoaderFunctionArgs } from "react-router";
import { authenticator } from "~/service/auth/auth.server";
import type { User } from "~/types";

export async function loader({ request }: LoaderFunctionArgs): Promise<User> {
	return await authenticator.authenticate(
		process.env.AUTHENTICATOR_STRATEGY ?? "",
		request,
	);
}

export default function Login() {
	return <></>;
}
