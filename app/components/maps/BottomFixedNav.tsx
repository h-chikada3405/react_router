import { useMap } from "@vis.gl/react-google-maps";
import { MaterialSymbol } from "react-material-symbols";
import { Link } from "react-router";
import { animateToLocation } from "~/lib/maps";
import "react-material-symbols/rounded";

export default function BottomFixedNav({
	currentLocation,
}: { currentLocation: google.maps.LatLngLiteral | null }) {
	const map = useMap();

	const handleClick = () => {
		if (map && currentLocation) {
			animateToLocation(map, currentLocation);
		}
	};

	return (
		<div className="fixed right-4 bottom-4 flex flex-col gap-2.5">
			<Link
				to="./clients"
				className="flex h-12 w-12 items-center justify-center rounded-full bg-white drop-shadow"
			>
				<MaterialSymbol
					icon="travel_explore"
					weight={300}
					size={24}
					color="#18181b"
				/>
			</Link>
			<button
				type="button"
				className="flex h-12 w-12 items-center justify-center rounded-full bg-white drop-shadow"
				onClick={handleClick}
			>
				<MaterialSymbol icon="near_me" weight={300} size={24} color="#18181b" />
			</button>
		</div>
	);
}
