import type { LoaderFunctionArgs } from "react-router";

export async function loader({ params }: LoaderFunctionArgs) {
	console.log(params);
}

export default function SearchQuery() {
	return <div>searchQuery</div>;
}
