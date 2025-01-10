import sidebarLogo from "~/assets/images/sidebar-logo.svg";

export default function SideBarLogo() {
  return (
    <div className="w-[280px] absolute bottom-0 left-0 -z-10">
      <img src={sidebarLogo} alt="CRM サイドバーロゴ" />
    </div>
  )
}
