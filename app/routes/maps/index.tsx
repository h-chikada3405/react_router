import { AdvancedMarker, Map as ClientMap } from "@vis.gl/react-google-maps";
import { useCallback } from "react";
import { Outlet, useRouteLoaderData } from "react-router";
import BottomFixedNav from "~/components/maps/BottomFixedNav";
import useGeolocation from "~/hooks/useGeolocation";

export default function Index() {
	const { MAP_ENV } = useRouteLoaderData("routes/maps/layout");
	const { currentLocation } = useGeolocation();

	/**
	 * マップの操作を停止した時に動作。中心座標を取得し近くの顧客を更新
	 *
	 * @returns {void}
	 */
	const handleIdle = useCallback((): void => {}, []);

	if (!currentLocation) {
		return <div>現在地を取得中です...</div>;
	}

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
				<BottomFixedNav currentLocation={currentLocation} />
			</ClientMap>
			<Outlet />
		</>
	);
}
