import React, { useEffect, useState } from "react";
import { getProjectData, getProjects } from './todoist_api_adapter';
import _ from 'lodash';
import './style.css';

getProjects();
const { PROJECT_ID } = require('../.env.json');

const useDependencies = () => {
	const [selectedItem, setSelectedItem] = useState(null);
	const [selectedItemChildren, setSelectedItemChildren] = useState([]);
	const [dependencies, setDependencies] = useState(
		localStorage.getItem(`${PROJECT_ID}-dependencies`)
			? JSON.parse(localStorage.getItem(`${PROJECT_ID}-dependencies`))
			: {}
	);

	useEffect(() => {
		localStorage.setItem(`${PROJECT_ID}-dependencies`, JSON.stringify(dependencies));
	}, [dependencies])

	const getAllChildren = (deps, items) => {
		let children = [];
		if (items.length === 0) return [];
		items.map(item => {
			const nonDuplicateChildren = []; // TODO
			children = [
				...children,
				...deps[item].children,
				...getAllChildren(deps, deps[item].children)
			];
		})
		return children;
	}

	// useEffect(() => {

	// }, [selectedItem])

	const getDep = (itemID) => {
		return (dependencies[itemID.toString()])
			? dependencies[itemID.toString()]
			: { level: 0, parent: null };
	}

	const changeParent = () => {

	}

	const moveItem = (itemID, newParentID) => {
		const tempDeps = _.cloneDeep(dependencies);
		const newItemObj = {
			level: 0,
			parents: [],
			children: []
		};
		if (!tempDeps[itemID]) tempDeps[itemID] = _.cloneDeep(newItemObj);
		if (!tempDeps[newParentID]) tempDeps[newParentID] = _.cloneDeep(newItemObj);
		tempDeps[newParentID].children.push(itemID);

		tempDeps[itemID].parents.push(newParentID);
		tempDeps[itemID].level = tempDeps[newParentID].level + 1;

		setDependencies(tempDeps)
	}

	const selectItem = (itemID) => {
		if (!selectedItem) return setSelectedItem(itemID);
		if (selectedItem === itemID) return setSelectedItem(null);
		console.log(`${itemID} now depends on ${selectedItem}`);
		moveItem(selectedItem, itemID);
		setSelectedItem(null);
	}
	const getDepsWithItemMovedToLevel = (deps, itemID, level) => {
		const tempDeps = _.cloneDeep(deps);

		return tempDeps;
	}
	const removeParent = (itemID, parentID) => {
		const tempDeps = _.cloneDeep(dependencies);
		tempDeps[itemID].parents.splice(tempDeps[itemID].parents.indexOf(parentID), 1);
		tempDeps[parentID].children.splice(tempDeps[parentID].children.indexOf(itemID), 1);
		setDependencies(tempDeps);
	}

	return {
		getDep,
		selectItem,
		removeParent,
		selectedItem,
		dependencies
	}
}

const App = () => {
	const [projectData, setProjectData] = useState({
		items: []
	});
	const { getDep, selectItem, removeParent, selectedItem, dependencies } = useDependencies();
	useEffect(() => {
		getProjectData(PROJECT_ID, setProjectData)
	}, [])
	const renderItems = (items, level) => {
		return items.map((item => item.parent_id
			? null
			: (
				<div className="item" key={item.id} onClick={() => selectItem(item.id)} style={{
					marginLeft: `${getDep(item.id).level * 20}px`,
					display: getDep(item.id).level === level ? 'block' : 'none',
					backgroundColor: (selectedItem === item.id) ? '#eee' : '#fff'
				}}>
					<div className="item-id">{item.id}</div>
					<div className="item-content">{item.content}</div>
					{dependencies[item.id]
						&& (
							<div>
								{dependencies[item.id].parents.map((parentID) => (
									<div
										className="parent-id"
										onClick={() => removeParent(item.id, parentID)}>
										{parentID}
									</div>
								))}
								{dependencies[item.id].children.map((childID) => <div className="child-id">{childID}</div>)}
							</div>
						)}
				</div>
			)))
	}
	return (
		<div>
			<h1>Project Tasks</h1>
			{renderItems(projectData.items, 0)}
			{renderItems(projectData.items, 1)}
			{renderItems(projectData.items, 2)}
			{renderItems(projectData.items, 3)}
			{renderItems(projectData.items, 4)}
		</div>
	)
}

export default App;
