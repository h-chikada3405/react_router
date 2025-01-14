import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import { clients } from "~/constants/maps";

export async function loader({ params }: LoaderFunctionArgs) {
	const clientId = params.clientId ? parseInt(params.clientId, 10) : undefined;
	return clients.find((client) => client.id === clientId);
}

export default function PlaceClientId() {
	const client = useLoaderData<typeof loader>();
	console.log(client);

	return (
		<div className="fixed w-full h-full top-0">gagaga</div>
	);
}
