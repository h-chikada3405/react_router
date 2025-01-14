/**
 * 2つの緯度・経度間の距離を計算する関数
 *
 * @param {Object} coords1 - 最初の地点の座標
 * @param {number} coords1.lat - 最初の地点の緯度
 * @param {number} coords1.lng - 最初の地点の経度
 * @param {Object} coords2 - 2番目の地点の座標
 * @param {number} coords2.lat - 2番目の地点の緯度
 * @param {number} coords2.lng - 2番目の地点の経度
 * @returns {number} - 2つの地点間の距離(km)
 * @see https://jingwen-z.github.io/distance-application-in-data-science/
 */
export const haversineDistance = (
	coords1: google.maps.LatLngLiteral,
	coords2: google.maps.LatLngLiteral,
): number => {
	const toRad = (value: number) => (value * Math.PI) / 180;

	const R = 6371; // 地球の半径(km)
	const dLat = toRad(coords2.lat - coords1.lat);
	const dLon = toRad(coords2.lng - coords1.lng);

	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(toRad(coords1.lat)) *
			Math.cos(toRad(coords2.lat)) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	return R * c;
};

/**
 * 距離をラベル形式でフォーマットする関数
 *
 * @param {number} distanceInKm - 距離(km)
 * @returns {string}
 * - 1km未満の場合は(m)
 * - 1km以上の場合は(km)
 * @example
 * formatDistanceLabel(0.8); // 800m
 * formatDistanceLabel(5);   // 5.0km
 */
export const formatDistanceLabel = (distanceInKm: number): string => {
	if (distanceInKm < 1) {
		return `${Math.round(distanceInKm * 1000)}m`;
	} else {
		return `${distanceInKm.toFixed(1)}km`;
	}
};

/**
 * 指定された出発地点と目的地の間の移動時間を取得する関数
 *
 * @param {google.maps.LatLngLiteral | null} origin - 出発地点の緯度と経度
 * @param {google.maps.LatLngLiteral} destination - 目的地の緯度と経度
 * @param {google.maps.TravelMode} travelMode - 移動手段
 * @returns {Promise<string | null>} - 移動時間(フォーマットされた文字列)または `null` を返却
 * @example
 * const travelTime = await calculateTravelTime(
 *   { lat: 35.681236, lng: 139.767125 }, // 出発地点
 *   { lat: 35.6895, lng: 139.6917 },     // 目的地
 *   google.maps.TravelMode.DRIVING       // 移動手段
 * );
 */
export const calculateTravelTime = (
	origin: google.maps.LatLngLiteral | null,
	destination: google.maps.LatLngLiteral,
	travelMode: google.maps.TravelMode,
): Promise<string | null> => {
	return new Promise((resolve) => {
		if (!origin || !destination) {
			resolve(null);
			return;
		}

		const directionsService = new window.google.maps.DirectionsService();
		directionsService.route(
			{
				origin,
				destination,
				travelMode,
			},
			(result, status) => {
				if (status === window.google.maps.DirectionsStatus.OK) {
					const drivingDuration =
						result?.routes[0].legs[0].duration?.text || null;
					resolve(drivingDuration);
				} else {
					console.error(`Directions request failed due to ${status}`);
					resolve(null);
				}
			},
		);
	});
};

/**
 * 指定された座標に地図をアニメーション付きで移動させる関数
 *
 * @param {google.maps.Map} map - アニメーションを適用する地図インスタンス
 * @param {google.maps.LatLngLiteral | null} target
 * @param {number} target.lat - 移動先の緯度
 * @param {number} target.lng - 移動先の経度
 * @param {number} [duration=800] - アニメーションの持続時間(ms)
 * @returns {void}
 */
export const animateToLocation = (
	map: google.maps.Map,
	target: google.maps.LatLngLiteral | null,
	duration = 800,
): void => {
	if (!map || !map.getCenter() || !target) {
		return;
	}
	const startLat = map.getCenter()?.lat();
	const startLng = map.getCenter()?.lng();
	const startTime = Date.now();

	const easeInOutCubic = (t: number): number => {
		return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
	};

	const animate = () => {
		const elapsedTime = Date.now() - startTime;
		let progress = Math.min(elapsedTime / duration, 1);
		progress = easeInOutCubic(progress);

		if (!startLat || !startLng) {
			return;
		}

		const newLat = startLat + (target.lat - startLat) * progress;
		const newLng = startLng + (target.lng - startLng) * progress;

		map.setCenter({ lat: newLat, lng: newLng });

		if (progress < 1) {
			requestAnimationFrame(animate);
		}
	};

	animate();
	map.setZoom(16);
};
