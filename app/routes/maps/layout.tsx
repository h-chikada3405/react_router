import { APIProvider } from "@vis.gl/react-google-maps";
import { type LoaderFunction, Outlet, useLoaderData } from "react-router";
import { ClientOnly } from "remix-utils/client-only";
import type { MapEnvData } from "~/types/env";

export interface MapsLoaderData {
	MAP_ENV: MapEnvData;
}

export const loader: LoaderFunction = async (): Promise<MapsLoaderData> => {
	return {
		MAP_ENV: {
			ID: process.env.GOOGLE_MAP_ID || "",
			API_KEY: process.env.GOOGLE_MAP_API_KEY || "",
		},
	};
};

export default function Layout() {
	const { MAP_ENV } = useLoaderData<MapsLoaderData>();

	return (
		<div className="h-screen w-screen">
			<ClientOnly>
				{() => (
					<APIProvider apiKey={MAP_ENV.API_KEY}>
						<Outlet />
					</APIProvider>
				)}
			</ClientOnly>
		</div>
	);
}
