import React, { useEffect, useState } from "react";
import { getProjectData, getProjects } from './todoist_api_adapter';
import { getAllBlocking, getDeepestWaitingLevel } from './utils';
import _ from 'lodash';
import './style.css';

getProjects();
const { PROJECT_ID } = require('../.env.json');

const useDependencies = () => {
	const [selectedItem, setSelectedItem] = useState(null);
	const [selectedItemBlocking, setSelectedItemBlocking] = useState([]);
	const [dependencies, setDependencies] = useState(
		localStorage.getItem(`${PROJECT_ID}-dependencies`)
			? JSON.parse(localStorage.getItem(`${PROJECT_ID}-dependencies`))
			: {}
	);

	useEffect(() => {
		localStorage.setItem(`${PROJECT_ID}-dependencies`, JSON.stringify(dependencies));
	}, [dependencies])

	// useEffect(() => {

	// }, [selectedItem])

	const getDep = (itemID) => {
		return (dependencies[itemID.toString()])
			? dependencies[itemID.toString()]
			: { level: 0, waitingIDs: null,  };
	}

	const changeWaiting = () => {

	}

	const moveItem = (itemID, newWaitingID) => {
		let tempDeps = _.cloneDeep(dependencies);
		const newItemObj = {
			level: 0,
			waitingIDs: [],
			blockingIDs: []
		};
		if (!tempDeps[itemID]) tempDeps[itemID] = _.cloneDeep(newItemObj);
		if (!tempDeps[newWaitingID]) tempDeps[newWaitingID] = _.cloneDeep(newItemObj);
		tempDeps[newWaitingID].blockingIDs.push(itemID);

		tempDeps[itemID].waitingIDs.push(newWaitingID);
		tempDeps = getDepsWithItemMovedToLevel(tempDeps, itemID, getDeepestWaitingLevel(tempDeps, itemID)+ 1);

		setDependencies(tempDeps)
	}

	const selectItem = (itemID) => {
		if (!selectedItem) return setSelectedItem(itemID);
		if (selectedItem === itemID) return setSelectedItem(null);
		moveItem(selectedItem, itemID);
		setSelectedItem(null);
	}
	const getDepsWithItemMovedToLevel = (deps, itemID, level) => {
		const tempDeps = _.cloneDeep(deps);
		const itemBlocking = getAllBlocking(tempDeps, [itemID]);
		const levelsMoved = level - tempDeps[itemID].level;
		tempDeps[itemID].level += levelsMoved;
		itemBlocking.map(blockingID => tempDeps[blockingID].level += levelsMoved);
		return tempDeps;
	}
	const removeWaiting = (itemID, waitingID) => {
		let tempDeps = _.cloneDeep(dependencies);
		tempDeps[itemID].waitingIDs.splice(tempDeps[itemID].waitingIDs.indexOf(waitingID), 1);
		tempDeps[waitingID].blockingIDs.splice(tempDeps[waitingID].blockingIDs.indexOf(itemID), 1);
		let deepestWaitingLevel = getDeepestWaitingLevel(tempDeps, itemID)
		tempDeps = getDepsWithItemMovedToLevel(tempDeps, itemID, deepestWaitingLevel + 1);
		setDependencies(tempDeps);
	}

	return {
		getDep,
		selectItem,
		removeWaiting,
		selectedItem,
		dependencies
	}
}

const App = () => {
	const [projectData, setProjectData] = useState({
		items: []
	});
	const { getDep, selectItem, removeWaiting, selectedItem, dependencies } = useDependencies();
	useEffect(() => {
		getProjectData(PROJECT_ID, setProjectData)
	}, [])
	const renderItems = (items, level) => {
		return items.map((item => item.parent_id
			? null
			: (
				<div className="item" key={item.id} style={{
					marginLeft: `${getDep(item.id).level * 20}px`,
					display: getDep(item.id).level === level ? 'block' : 'none',
					backgroundColor: (selectedItem === item.id) ? '#eee' : '#fff'
				}}>
					<div onClick={() => selectItem(item.id)}>
						<div className="item-id">{item.id}</div>
						<div className="item-content">{item.content}</div>
					</div>
					{dependencies[item.id]
						&& (
							<div>
								{dependencies[item.id].waitingIDs.map((waitingID) => (
									<div
										className="waiting-id"
										onClick={(evt) => {
											evt.preventDefault();
											removeWaiting(item.id, waitingID);
										}}>
										{waitingID}
									</div>
								))}
								{dependencies[item.id].blockingIDs.map((blockingID) => <div className="blocking-id">{blockingID}</div>)}
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
