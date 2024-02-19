import Link from "next/link";
import { adminNavLinks } from "../../../../raw-data/nav-links";
// import { SideNav } from "../components/sideNav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className=" min-h-fit flex-col">
      <div className="flex flex-col md:flex-row flex-wrap">
        <aside className="bg-landmark-dark md:w-40 py-5">
          <nav>
            <ul>
              {adminNavLinks.map((link) => (
                <li
                  className={"border border-landmark-light m-2"}
                  key={link.name}
                >
                  <Link href={link.path}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <main className="flex-1 m-6">{children}</main>
      </div>
    </div>
  );
}
