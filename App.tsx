import React, { useEffect, useState } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { storageService, supabase } from './services/storage';
import { DashboardPage } from './views/dashboard/DashboardPage';
import { DocumentationPage } from './views/documentation/DocumentationPage';
import { LandingPage } from './views/landing/LandingPage';
import { PrivacyPolicyPage } from './views/legal/PrivacyPolicyPage';
import { TermsPage } from './views/legal/TermsPage';
import { ProfilePage } from './views/profile/ProfilePage';

const App: React.FC = () => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
	const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
	const [isResettingPassword, setIsResettingPassword] =
		useState<boolean>(false);

	useEffect(() => {
		// Initial Session Check
		const initializeAuth = async () => {
			const session = await storageService.getCurrentSession();
			setIsAuthenticated(!!session);
			setIsAuthLoading(false);
		};

		initializeAuth();

		// Listen for auth changes (Login, Logout, OAuth Callback)
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, session) => {
			console.log('Auth event:', event);
			setIsAuthenticated(!!session);

			// Don't reset password state if user is currently in password reset flow
			// Only reset on normal sign in, not on sign out during password reset
			if (event === 'SIGNED_IN' && !isResettingPassword) {
				setIsResettingPassword(false);
			}

			// Don't reset password state on sign out if we're in password reset flow
			if (event === 'SIGNED_OUT' && isResettingPassword) {
				// Keep isResettingPassword as true during sign out in password reset flow
				return;
			}

			if (event === 'USER_UPDATED') {
				// Don't reset password state on user updates during password reset
			}

			if (event === 'PASSWORD_RECOVERY') {
				setIsResettingPassword(true);
			}
		});

		return () => subscription.unsubscribe();
	}, []);

	const handleLogin = () => {
		setIsAuthenticated(true);
		setIsResettingPassword(false);
	};

	const handleLogout = () => {
		storageService.logout();
		setIsResettingPassword(false);
	};

	if (isAuthLoading) {
		return (
			<div className="min-h-screen bg-[#08090A] flex items-center justify-center text-[#555]">
				Loading...
			</div>
		);
	}

	// Protected Route Wrapper
	const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
		if (!isAuthenticated) {
			return <Navigate to="/" replace />;
		}
		return children;
	};

	return (
		<HashRouter>
			<Routes>
				{/* Public Landing & Login */}
				<Route
					path="/"
					element={
						isAuthenticated && !isResettingPassword ? (
							<Navigate to="/dashboard" replace />
						) : (
							<LandingPage
								onLogin={handleLogin}
								isResettingPassword={isResettingPassword}
								setIsResettingPassword={setIsResettingPassword}
							/>
						)
					}
				/>

				{/* Owner Dashboard (Protected) */}
				<Route
					path="/dashboard"
					element={
						<ProtectedRoute>
							<DashboardPage onLogout={handleLogout} />
						</ProtectedRoute>
					}
				/>

				{/* Documentation (Protected) */}
				<Route
					path="/documentation"
					element={
						<ProtectedRoute>
							<DocumentationPage />
						</ProtectedRoute>
					}
				/>

				{/* Legal Pages (Public) */}
				<Route path="/privacy" element={<PrivacyPolicyPage />} />
				<Route path="/terms" element={<TermsPage />} />

				{/* Public Profile/Menu View (Customer) - Dynamic Slug */}
				<Route path="/menu/:slug" element={<ProfilePage />} />

				{/* Redirect unknown routes */}
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</HashRouter>
	);
};

export default App;
