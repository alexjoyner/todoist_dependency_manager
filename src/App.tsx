import React, { useState } from 'react';
import { ProjectDependencyTree } from './ProjectDependencyTree/ProjectDependencyTree';
import { ProjectSelector } from './ProjectSelector/ProjectSelector';
import './style.css';
const { PROJECT_ID } = require('../.env.json');

export const App = () => {
	const [selectedProjectId, setSelectedProject] = useState(null);
	return (selectedProjectId)
		? (
			<div>
				<button
					className="removeSelectedProject"
					onClick={() => setSelectedProject(null)}>
						X
				</button>
				<ProjectDependencyTree PROJECT_ID={selectedProjectId} />
			</div>
		)
		: <ProjectSelector onSelect={(project) => setSelectedProject(project.id)} />
}