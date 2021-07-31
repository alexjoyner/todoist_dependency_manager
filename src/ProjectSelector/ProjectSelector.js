import React, { useState, useEffect } from 'react';
import { getProjects } from '../todoist_api_adapter';
export const ProjectSelector = ({ onSelect }) => {
	const [projects, setProjects] = useState([]);

	useEffect(() => {
		async function fetchData() {
			const response = await getProjects();
			setProjects(response.projects);
		}
		fetchData();
	}, []);

	return (
		<div>
			<h1>Projects</h1>
			{projects.map(project => (
				<div className="item" onClick={() => onSelect(project)}>
					{project.name}
				</div>
			))}
		</div>
	);
}