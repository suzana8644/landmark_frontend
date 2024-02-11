import Link from "next/link";
import { adminNavLinks } from "../../../../raw-data/nav-links";
// import { SideNav } from "../components/sideNav";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex flex-col md:flex-row flex-1">
                <aside className='bg-amber-100 w-full md:w-40'>
                    <nav>
                        <ul>
                            {adminNavLinks.map(link => (
                                <li className='m-2' key={link.name}>
                                    <Link href={link.path}>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </aside>
                <main className="flex-1">{children}</main>
            </div>
        </div>
        // <div className="flex flex-col gap-10">
        //     <SideNav />
        //     {children}
        // </div>
    );
}