import type { FormEventHandler } from "react";
import { useNavigate, useSubmit } from "react-router";
import { Search, SearchInput } from "../ui/Search";

interface ClientSearchProps {
	q?: string;
}

export default function ClientsSearch({ q }: ClientSearchProps) {
	const navigate = useNavigate();
	const submit = useSubmit();

	const handleSubmit: FormEventHandler<HTMLFormElement> = (event): void => {
		event.preventDefault();
		if (q) {
			navigate(`/clients/search?q=${q}`);
		}
	};

	return (
		<div>
			<Search
				id="clients-search"
				onChange={(event) => {
					const isFirstSearch = q === null;
					submit(event.currentTarget, {
						action: "/clients",
						replace: !isFirstSearch,
					});
				}}
				onSubmit={handleSubmit}
			>
				<SearchInput
					aria-label="顧客検索"
					defaultValue={q || ""}
					id="q"
					name="q"
					placeholder="顧客No・会社名・電話番号・住所で検索"
					type="search"
				/>
			</Search>
		</div>
	);
}
