import {
	Links,
	type LoaderFunction,
	Meta,
	MetaFunction,
	Outlet,
	Scripts,
	ScrollRestoration,
	isRouteErrorResponse,
	redirect,
} from "react-router";
import GlobalNav from "~/components/layout/GlobalNav";
import type { Route } from "./+types/root";
import stylesheet from "./assets/styles/app.css?url";
import { getUserSession } from "./service/auth/auth.server";
import { RootLoaderData } from "./types/.";
import SideBarLogo from "./components/ui/SideBarLogo";
import { META_INFO } from "./constants/meta";

export const loader: LoaderFunction = async ({ request }): Promise<RootLoaderData> => {
	const url = new URL(request.url);
	const envData = {
		TITLE: process.env.SITE_TITLE || "",
		DESCRIPTION: process.env.SITE_DESCRIPTION || "",
	};

	if (url.pathname.startsWith("/auth")) {
		return {
			ENV: envData,
		};
	}

	const user = await getUserSession(request);

	return {
		ENV: envData,
		USER: user,
	};
}

export const links: Route.LinksFunction = () => [
	{ rel: "preconnect", href: "https://fonts.googleapis.com" },
	{
		rel: "preconnect",
		href: "https://fonts.gstatic.com",
		crossOrigin: "anonymous",
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New&display=swap",
	},
	{ rel: "stylesheet", href: stylesheet },
];

export const meta: MetaFunction = ({ data, location }) => {
	const { ENV } = data as RootLoaderData;
	const specificMetaInfo = META_INFO[location.pathname];
	const parentPath = location.pathname.split("/").slice(0, 2).join("/");
	const parentMetaInfo = META_INFO[parentPath];
	const metaInfo = specificMetaInfo ||
		parentMetaInfo || {
			title: ENV.TITLE,
			description: ENV.DESCRIPTION,
		};

	return [
		{
			title: `${metaInfo.title ? `${metaInfo.title} | ${ENV.TITLE}` : ENV.TITLE}`,
		},
		{
			name: "description",
			content: `${metaInfo.description ? metaInfo.description : ENV.DESCRIPTION}`,
		},
	];
};

export default function App() {
	return (
		<html lang="ja">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta name="robots" content="noindex" />
				<Meta />
				<Links />
			</head>
			<body>
				<div className="flex h-full py-5 pr-12 pl-5">
					<GlobalNav />
					<main className="w-full">
						<Outlet />
					</main>
					<SideBarLogo />
				</div>
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let message = "Oops!";
	let details = "An unexpected error occurred.";
	let stack: string | undefined;

	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? "404" : "Error";
		details =
			error.status === 404
				? "The requested page could 	not be found."
				: error.statusText || details;
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message;
		stack = error.stack;
	}

	return (
		<main className="container mx-auto p-4 pt-16">
			<h1>{message}</h1>
			<p>{details}</p>
			{stack && (
				<pre className="w-full overflow-x-auto p-4">
					<code>{stack}</code>
				</pre>
			)}
		</main>
	);
}
