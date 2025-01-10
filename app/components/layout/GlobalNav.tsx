import { MaterialSymbol, SymbolCodepoints } from "react-material-symbols";
import { Link, NavLink } from "react-router";
import UserMenu from "./UserMenu";
import "react-material-symbols/rounded";
import logoIcon from "~/assets/images/logo-icon.svg";
import { cn } from "~/lib/utils";

export function GlobalNavLink({
  to,
  icon,
  label,
  className,
}: {
  to: string;
  icon: SymbolCodepoints;
  label: string;
  className?: string;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(`flex items-center gap-x-[15px] rounded-md px-[10px] py-[5px] text-sm ${
          isActive ? "bg-zinc-400 text-white" : "transition hover:bg-zinc-300"
        }`, className)
      }
    >
      {({ isActive }) => (
        <>
          <i
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
              isActive ? "bg-orange-400" : "bg-zinc-400"
            }`}
          >
            <MaterialSymbol icon={icon} weight={300} size={18} className="text-white" />
          </i>
          {label}
        </>
      )}
    </NavLink>
  );
}

export default function GlobalNav() {
	return (
		<aside className="h-full w-1/6 min-w-56 max-w-64 rounded-lg border border-white bg-zinc-200 bg-opacity-50 p-2.5">
			<Link to="/" className="ml-auto block h-3 w-3">
				<img src={logoIcon} alt="CRM ロゴアイコン" />
			</Link>
			<nav className="space-y-12">
				<UserMenu />
				<div className="space-y-[5px] border-zinc-200 border-t pt-3.5">
					<GlobalNavLink to="/clients" icon="manage_search" label="顧客管理" />
          <GlobalNavLink to="/maps" icon="map" label="マップ" />
          <GlobalNavLink to="/schedule" icon="calendar_clock" label="スケジュール" />
				</div>
			</nav>
		</aside>
	);
}
