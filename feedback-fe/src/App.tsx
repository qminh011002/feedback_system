import useRouteElement from '@/hooks/useRouteElement';
import React from 'react';

export default function App() {
	const router = useRouteElement();
	return <React.Fragment>{router}</React.Fragment>;
}
