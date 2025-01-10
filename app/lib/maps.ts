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
