import { redirect, type LoaderFunctionArgs } from "react-router";
import { getUserSession } from "~/service/auth/auth.server";

export async function loader({ request }: LoaderFunctionArgs): Promise<void> {
	try {
		const user = await getUserSession(request);
		if (user) {
			throw redirect("/");
		}
	} catch (error) {
		if (error instanceof Response) {
			throw error;
		}
		console.error(error);
		redirect("/auth/login");
	}
}

export default function Callback() {
	console.log("callback");

	return <></>;
}
