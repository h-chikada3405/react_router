import { type LoaderFunctionArgs, useLoaderData } from "react-router";
import { clients } from "~/constants/maps";

export async function loader({ params }: LoaderFunctionArgs) {
	const clientId = params.clientId
		? Number.parseInt(params.clientId, 10)
		: undefined;
	return clients.find((client) => client.id === clientId);
}

export default function PlaceClientId() {
	const client = useLoaderData<typeof loader>();
	console.log(client);

	return <div className="fixed top-0 h-full w-full">gagaga</div>;
}
