import {
	AdvancedMarker,
	Map as ClientMap,
	Pin,
	useMap,
} from "@vis.gl/react-google-maps";
import { useCallback } from "react";
import { Outlet, useNavigate, useRouteLoaderData } from "react-router";
import BottomFixedNav from "~/components/maps/BottomFixedNav";
import { MPA_MARKER_OPTIONS, clients } from "~/constants/maps";
import useGeolocation from "~/hooks/useGeolocation";
import { animateToLocation } from "~/lib/maps";
import type { Client } from "~/types";

export default function Index() {
	const { MAP_ENV } = useRouteLoaderData("routes/maps/layout");
	const { currentLocation } = useGeolocation();
	const navigate = useNavigate();
	const map = useMap();

	/**
	 * マップの操作を停止した時に動作。中心座標を取得し近くの顧客を更新
	 *
	 * @returns {void}
	 */
	const handleIdle = useCallback((): void => {}, []);

	if (!currentLocation) {
		return <div>現在地を取得中です...</div>;
	}

	const handleMarkerClick = (client: Client) => {
		if (map && client.position) {
			animateToLocation(map, client.position);
		}
		navigate(`./place/${client.id}`);
	};

	return (
		<>
			<ClientMap
				defaultCenter={currentLocation}
				defaultZoom={16}
				gestureHandling="greedy"
				disableDefaultUI={true}
				reuseMaps={true}
				mapId={MAP_ENV.ID}
				colorScheme="DARK"
				onIdle={handleIdle}
			>
				<AdvancedMarker position={currentLocation} title="現在地" />
				{clients.map((client) => (
					<AdvancedMarker
						key={client.id}
						position={client.position}
						title={client.name}
						onClick={() => handleMarkerClick(client)}
					>
						<Pin {...MPA_MARKER_OPTIONS[client.status]} />
					</AdvancedMarker>
				))}
				<BottomFixedNav currentLocation={currentLocation} />
			</ClientMap>
			<Outlet />
		</>
	);
}
