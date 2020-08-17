import React from 'react';
import { ProjectDependencyTree } from './ProjectDependencyTree/ProjectDependencyTree';

const { PROJECT_ID } = require('../.env.json');

export const App = () => {
	return <ProjectDependencyTree {...{ PROJECT_ID }} />
}