import { useRouteLoaderData } from "react-router";
import type { RootLoaderData } from "~/types/.";

/**
 * `root` ローダーデータから USER 情報を取得
 *
 * @returns {RootLoaderData["USER"] | null}
 */
export default function useUserData(): RootLoaderData["USER"] | null {
	const data = useRouteLoaderData<RootLoaderData>("root");
	return data?.USER || null;
}
