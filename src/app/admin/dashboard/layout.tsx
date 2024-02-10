import { SideNav } from "../components/sideNav";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-10">
            <SideNav />
            {children}
        </div>
    );
}