import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Element, ...rest }) => {
	const isAuthenticated = !!localStorage.getItem('ACCESS_TOKEN');

	return (
		<Route
			{...rest}
			element={isAuthenticated ? <Element /> : <Navigate to="/login" />}
		/>
	);
};

export default ProtectedRoute;
