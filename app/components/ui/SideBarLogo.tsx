import sidebarLogo from "~/assets/images/sidebar-logo.svg";

export default function SideBarLogo() {
	return (
		<div className="-z-10 absolute bottom-0 left-0 w-[280px]">
			<img src={sidebarLogo} alt="CRM サイドバーロゴ" />
		</div>
	);
}
