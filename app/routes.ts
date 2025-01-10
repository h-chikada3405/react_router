import {
	type RouteConfig,
	index,
	layout,
	prefix,
	route,
} from "@react-router/dev/routes";

export default [
	index("routes/index.tsx"),

	...prefix("auth", [
		route("login", "routes/auth/login.tsx"),
		route("callback", "routes/auth/callback.tsx"),
	]),

	...prefix("clients", [
		layout("routes/clients/layout.tsx", [
			index("routes/clients/index.tsx"),
			route("search", "routes/clients/search.tsx"),
			route("detail/:clientId", "routes/clients/detail.$clientId.tsx"),
		]),
	]),

	layout("routes/maps/layout.tsx", [
		route("maps", "routes/maps/index.tsx", [
			route("clients", "routes/maps/clients.tsx"),
			route("place/:clientId", "routes/maps/place.$clientId.tsx"),
			route("search/:query", "routes/maps/search.$query.tsx"),
		]),
	]),

	layout("routes/schedule/layout.tsx", [
		route("schedule", "routes/schedule/index.tsx"),
	]),
] satisfies RouteConfig;
