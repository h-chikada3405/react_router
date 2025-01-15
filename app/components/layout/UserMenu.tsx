import { MaterialSymbol, type SymbolCodepoints } from "react-material-symbols";
import avatarImage from "~/assets/images/avatar.png";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "~/components/ui/DropdownMenu";
import useIsMobile from "~/hooks/useIsMobile";
import useUserData from "~/hooks/useUserData";
import { Avatar, AvatarImage } from "../ui/Avatar";
import { Switch } from "../ui/Switch";
import "react-material-symbols/rounded";
import { Link } from "react-router";
import { cn } from "~/lib/utils";
import { Label } from "../ui/Label";

function AvatarContent({
	userData,
}: { userData: ReturnType<typeof useUserData> }) {
	return (
		<Avatar className="flex h-auto w-auto items-center gap-x-2.5 px-2.5 font-bold text-xs">
			<AvatarImage src={avatarImage} className="h-8 w-8 rounded-full" />
			{userData?.sub} {userData?.name}
		</Avatar>
	);
}

function IconWithLabel({
	icon,
	label,
	className,
	children,
	...props
}: {
	icon: SymbolCodepoints;
	label: string;
	className?: string;
	children?: React.ReactNode;
}) {
	return (
		<div
			className={cn(
				"flex w-full items-center gap-x-[15px] rounded-md px-[10px] py-[5px] text-sm",
				className,
			)}
			{...props}
		>
			<i className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-md bg-zinc-400">
				<MaterialSymbol
					icon={icon}
					weight={300}
					size={18}
					className="text-white"
				/>
			</i>
			{label}
			{children}
		</div>
	);
}

function NoticeContent() {
	return (
		<Label htmlFor="notice-switch" className="block cursor-pointer">
			<IconWithLabel icon="notifications" label="通知">
				<Switch id="notice-switch" className="ml-auto" />
			</IconWithLabel>
		</Label>
	);
}

function DarkModeContent() {
	return (
		<Label htmlFor="dark-mode-switch" className="block cursor-pointer">
			<IconWithLabel icon="settings_night_sight" label="ダークモード">
				<Switch id="dark-mode-switch" className="ml-auto" />
			</IconWithLabel>
		</Label>
	);
}

function LogoutContent() {
	return (
		<Link to="/auth/logout" className="flex items-center">
			<IconWithLabel icon="logout" label="ログアウト" />
		</Link>
	);
}

export default function UserMenu() {
	const userData = useUserData();
	const isMobile = useIsMobile();

	const menuItems = (
		<>
			<NoticeContent />
			<DarkModeContent />
			<LogoutContent />
		</>
	);

	return (
		<div className="mt-5 py-2.5">
			{isMobile ? (
				<DropdownMenu>
					<DropdownMenuTrigger>
						<AvatarContent userData={userData} />
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuLabel>
							<AvatarContent userData={userData} />
						</DropdownMenuLabel>
						<DropdownMenuGroup>{menuItems}</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			) : (
				<div>
					<AvatarContent userData={userData} />
					<div className="mt-3.5 space-y-[5px]">{menuItems}</div>
				</div>
			)}
		</div>
	);
}
