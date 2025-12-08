// src/app/App.tsx
import {Navigate, Route, Routes} from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import AppPage from '../pages/AppPage';
import ProtectedRoute from '../features/auth/ProtectedRoute';

const App = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage/>}/>

            <Route
                path="/app"
                element={
                    <ProtectedRoute>
                        <AppPage/>
                    </ProtectedRoute>
                }
            />

            <Route path="*" element={<Navigate to="/login" replace/>}/>
        </Routes>
    );
};

export default App;
