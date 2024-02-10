import { adminNavLinks } from "../../../../raw-data/nav-links";
import Link from "next/link";

export function SideNav() {
    return (
        <>
            {adminNavLinks.map((link) => (
                <Link key={link.name} href={link.path}>
                        <span className="text-2xl font-bold">{link.name}</span>
                </Link>
            ))}
        </>
    );
}