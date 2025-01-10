import { useEffect } from "react";
import { type LoaderFunctionArgs, Outlet, useLoaderData } from "react-router";
import ClientsSearch from "~/components/clients/ClientsSearch";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url);
	const q = url.searchParams.get("q");

	return { q };
};

export default function Layout() {
	const { q } = useLoaderData();

	useEffect(() => {
		const searchField = document.getElementById("q");
		if (searchField instanceof HTMLInputElement) {
			searchField.value = q || "";
		}
	}, [q]);

	return (
		<div>
			<ClientsSearch q={q || ""} />
			<Outlet />
		</div>
	);
}
