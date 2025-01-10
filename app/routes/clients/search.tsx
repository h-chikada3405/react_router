import { type LoaderFunctionArgs, useLoaderData } from "react-router";
import type { Client } from "~/types";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url);
	const q = url.searchParams.get("q");
	const response = await fetch(
		`http://localhost:8000/client/search?query=${q}`,
	);
	const clients = await response.json();
	return { clients };
};

export default function ClientsSearch() {
	const { clients } = useLoaderData<typeof loader>();

	return (
		<div>
			{clients.map((client: Client) => (
				<div key={client.id}>{client.name}</div>
			))}
		</div>
	);
}
