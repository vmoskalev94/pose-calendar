import {CalendarPage} from "./pages/CalendarPage";
import {AppShell} from "./components/layout/AppShell";
import {Sidebar} from "./components/layout/Sidebar";
import {MainArea} from "./components/layout/MainArea";
import {TopBar} from "./components/layout/TopBar";
import {ThemeProvider} from "./components/providers/ThemeProvider";
import {ToastProvider} from "./components/providers/ToastProvider";

export default function App() {
    return (
        <ThemeProvider>
            <ToastProvider>
                <AppShell>
                    <Sidebar/>
                    <MainArea>
                        <TopBar/>
                        <CalendarPage/>
                    </MainArea>
                </AppShell>
            </ToastProvider>
        </ThemeProvider>
    );
}
