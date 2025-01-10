import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "~/components/ui/DropdownMenu";
import { Avatar, AvatarImage } from "../ui/Avatar";
import useUserData from "~/hooks/useUserData";
import avatarImage from "~/assets/images/avatar.png";
import useIsMobile from "~/hooks/useIsMobile";
import { Switch } from "../ui/Switch";
import { MaterialSymbol, SymbolCodepoints } from "react-material-symbols";
import "react-material-symbols/rounded";
import { Label } from "../ui/Label";
import { Link } from "react-router";
import { cn } from "~/lib/utils";

function AvatarContent({ userData }: { userData: ReturnType<typeof useUserData> }) {
  return (
    <Avatar className="w-auto h-auto flex items-center gap-x-2.5 font-bold text-xs px-2.5">
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
      className={cn("w-full flex items-center gap-x-[15px] rounded-md px-[10px] py-[5px] text-sm", className)}
      {...props}
    >
      <i className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-md bg-zinc-400">
        <MaterialSymbol icon={icon} weight={300} size={18} className="text-white" />
      </i>
      {label}
      {children}
    </div>
  );
}

function NoticeContent() {
  return (
		<Label htmlFor="notice-switch" className="cursor-pointer block">
			<IconWithLabel icon="notifications" label="通知">
				<Switch id="notice-switch" className="ml-auto" />
			</IconWithLabel>
		</Label>
  );
}

function DarkModeContent() {
  return (
		<Label htmlFor="dark-mode-switch" className="cursor-pointer block">
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
						<DropdownMenuGroup>
							{menuItems}
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			) : (
				<div>
					<AvatarContent userData={userData} />
					<div className="space-y-[5px] mt-3.5">
						{menuItems}
					</div>
				</div>
			)}
		</div>
	);
}
