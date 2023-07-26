import NavigationItem from "../ui/NavigationItem";

type SideBarProps = {
  pages: {
    href: string;
    name: string;
  }[];
};

export default function SideBar({ pages }: SideBarProps) {
  return (
    <nav className="w-64 bg-gray-900 p-5">
      {pages.map((page) => (
        <NavigationItem key={page.href} {...page} />
      ))}
    </nav>
  );
}
