import { MaterialSymbol } from "react-material-symbols";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "~/components/ui/ContextMenu";
import "react-material-symbols/rounded";

export default function Index() {
	return (
		<div>
			<h1>スケジュール</h1>
			<ContextMenu>
				<ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed bg-blue-200 bg-opacity-80 text-sm">
					Right click here
				</ContextMenuTrigger>
				<ContextMenuContent className="w-24 rounded border-white bg-zinc-200 bg-opacity-50 p-x-1.5 py-0 backdrop-blur-sm">
					<ContextMenuItem className="cursor-pointer justify-between p-1.5 text-xs text-zinc-600 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:bg-zinc-200 last:after:hidden">
						詳細
						<MaterialSymbol
							icon="info"
							weight={400}
							size={14}
							className="text-zinc-600"
						/>
					</ContextMenuItem>
					<ContextMenuItem className="cursor-pointer justify-between p-1.5 text-xs text-zinc-600 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:bg-zinc-200 last:after:hidden">
						編集
						<MaterialSymbol
							icon="edit"
							weight={400}
							size={14}
							className="text-zinc-600"
						/>
					</ContextMenuItem>
					<ContextMenuItem className="cursor-pointer justify-between p-1.5 text-xs text-zinc-600 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:bg-zinc-200 last:after:hidden">
						削除
						<MaterialSymbol
							icon="delete"
							weight={400}
							size={14}
							className="text-zinc-600"
						/>
					</ContextMenuItem>
					<ContextMenuItem className="cursor-pointer justify-between p-1.5 text-xs text-zinc-600 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:bg-zinc-200 last:after:hidden">
						複製
						<MaterialSymbol
							icon="content_copy"
							weight={400}
							size={14}
							className="text-zinc-600"
						/>
					</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>
		</div>
	);
}
