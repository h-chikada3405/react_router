import { useEffect, useState } from "react";

interface GeolocationState {
	currentLocation: google.maps.LatLngLiteral | null;
	error: string | null;
}

/**
 * ユーザーの現在の位置情報を取得するカスタムフック
 *
 * @returns {object} 位置情報およびエラーメッセージを含むオブジェクト
 * @returns {Position | null} position - 現在の位置情報（緯度・経度）
 * @returns {string | null} error - エラーメッセージ（位置情報取得に失敗した場合）
 * @example
 * const { position, error } = useGeolocation();
 * if (error) {
 *   alert(error);
 * }
 */
export default function useGeolocation(): GeolocationState {
	const [state, setState] = useState<GeolocationState>({
		currentLocation: null,
		error: null,
	});

	useEffect(() => {
		const getCurrentLocation = () => {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(
					(position) => {
						setState({
							currentLocation: {
								lat: position.coords.latitude,
								lng: position.coords.longitude,
							},
							error: null,
						});
					},
					(err) => {
						setState((prevState) => ({
							...prevState,
							error: err.message,
						}));
					},
				);
			} else {
				setState((prevState) => ({
					...prevState,
					error: "お使いのブラウザが位置情報の利用をサポートしていません。",
				}));
			}
		};

		getCurrentLocation();

		const handleVisibilityChange = () => {
			if (document.visibilityState === "visible") {
				getCurrentLocation();
			}
		};

		document.addEventListener("visibilitychange", handleVisibilityChange);
		return () => {
			document.removeEventListener("visibilitychange", handleVisibilityChange);
		};
	}, []);

	return state;
}
