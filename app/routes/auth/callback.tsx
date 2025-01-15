import { type LoaderFunctionArgs, redirect } from "react-router";
import { getUserSession } from "~/service/auth/auth.server";

export async function loader({
	request,
}: LoaderFunctionArgs): Promise<Response> {
	await getUserSession(request);
	return redirect("/");
}

export default function Callback() {
	console.log("callback");

	return <></>;
}
