import * as React from "react";
import { MaterialSymbol } from "react-material-symbols";
import { Form, type FormProps } from "react-router";
import { cn } from "~/lib/utils";
import "react-material-symbols/rounded";

const Search = React.forwardRef<HTMLFormElement, FormProps>(
	({ className, onMouseEnter, ...props }, ref) => (
		<Form
			ref={ref}
			className={cn(
				"relative z-40 flex h-full w-full flex-col overflow-hidden rounded-full bg-white py-1.5 pr-6 pl-6 shadow-md",
				className,
			)}
			onMouseEnter={onMouseEnter}
			{...props}
		/>
	),
);
Search.displayName = "Search";

const SearchOverlay = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, onClick, ...props }, ref) => (
	<div
		ref={ref}
		className={cn("fixed inset-0 z-30 h-full w-full", className)}
		onClick={onClick}
		{...props}
	/>
));
SearchOverlay.displayName = "SearchOverlay";

const SearchInput = React.forwardRef<
	HTMLInputElement,
	React.InputHTMLAttributes<HTMLInputElement>
>(({ className, defaultValue, ...props }, ref) => {
	const [value, setValue] = React.useState(defaultValue || "");

	return (
		<div className="relative flex items-center gap-x-3.5">
			<MaterialSymbol
				icon="search"
				weight={500}
				size={24}
				className="text-zinc-400"
			/>
			<input
				ref={ref}
				value={value}
				onChange={(e) => setValue(e.target.value)}
				className={cn(
					"flex h-10 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground placeholder:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-50",
					className,
				)}
				{...props}
			/>
			{value && (
				<button
					type="button"
					onClick={() => setValue("")}
					className="flex h-6 w-6 items-center justify-center rounded-full bg-transparent text-zinc-300 transition hover:bg-zinc-200 hover:text-white"
				>
					<MaterialSymbol icon="close" weight={500} size={24} />
				</button>
			)}
		</div>
	);
});
SearchInput.displayName = "SearchInput";

const SearchList = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn(
			"max-h-[250px] overflow-y-auto overflow-x-hidden border-zinc-200 border-t py-1",
			className,
		)}
		{...props}
	/>
));
SearchList.displayName = "SearchList";

const SearchItem = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn(
			"relative flex cursor-default select-none items-center rounded-sm text-sm outline-none transition-colors hover:bg-zinc-200 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
			className,
		)}
		{...props}
	/>
));
SearchItem.displayName = "SearchItem";

export { Search, SearchOverlay, SearchInput, SearchList, SearchItem };
