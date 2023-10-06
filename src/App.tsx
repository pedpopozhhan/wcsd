import {
    GoAAppHeader,
    GoAMicrositeHeader,
    GoAAppFooter,
    GoAPageBlock,
    GoAAppFooterMetaSection,
    GoAOneColumnLayout,
} from "@abgov/react-components";
import { Outlet } from "react-router-dom";

export function App() {
    const headerTitle = "Wildfire Support";
    const menuItems = [
        { href: "/", text: "Home" },
        { href: "utilization", text: "Utilization" },
        { href: "/", text: "Invoicing" },
    ].map((item, idx) => (
        <a key={idx} href={item.href}>
            {item.text}
        </a>
    ));

    return (
        <GoAOneColumnLayout>
            <section slot="header">
                <GoAMicrositeHeader
                    type="beta"
                    version="React 1.0"
                    feedbackUrl="https://github.com/GovAlta/ui-components/issues/new/choose"
                />
                <GoAAppHeader
                    url="/"
                    heading={headerTitle}
                    maxContentWidth="100%"
                >
                    {menuItems}
                </GoAAppHeader>
            </section>

            <GoAPageBlock width="904px">
                <Outlet />
            </GoAPageBlock>
        </GoAOneColumnLayout>
    );
}

export default App;
