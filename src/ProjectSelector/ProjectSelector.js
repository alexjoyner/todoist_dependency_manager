import React from 'react';
import { getProjects } from '../todoist_api_adapter';
export const ProjectSelector = () => {
	const [projects, setProjects] = useState([]);

	useEffect(() => {

	}, []);

	return [projects, {}];
}