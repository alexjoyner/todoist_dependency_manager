import React, { useEffect, useState } from "react";
import { getProjectData, getProjects } from './todoist_api_adapter';
import { getAllBlocking, getDeepestWaitingLevel } from './utils';
import _ from 'lodash';
import './style.css';

getProjects();
const { PROJECT_ID } = require('../.env.json');

const useDependencies = () => {
	const [projectData, setProjectData] = useState({
		project: { id: 0 },
		items: []
	});
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

	// if a task is removed from todoist, update the tree on the next reload
	useEffect(() => {
		if(projectData.project && projectData.project.id == PROJECT_ID){
			let tempDeps = _.cloneDeep(dependencies);
			// get the id's of all current tasks
			const itemIds = projectData.items.map((item) => item.id);
			// get all dependency id's stale and active
			const depIds = Object.keys(tempDeps).map(id => parseInt(id));
			// for each id, check if that id is still in the task list
			depIds.map(itemId => {
				if(itemIds.indexOf(itemId) === -1){
					// if it isn't unblock all waiting items
					tempDeps[itemId].blockingIDs.map((blockingID) => {
						tempDeps = removeWaiting(tempDeps, blockingID,  itemId);
					});
					// if it isn't unblock all waiting items
					tempDeps[itemId].waitingIDs.map((waitingID) => {
						tempDeps = removeWaiting(tempDeps, itemId, waitingID);
					});
					// then remove item from dependencies
					delete tempDeps[itemId];
				}
			})
			// then update the tree
			setDependencies(tempDeps);
		}
	}, [projectData]);

	const getDep = (itemID) => {
		return (dependencies[itemID])
			? dependencies[itemID]
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
	const removeWaiting = (deps, itemID, waitingID) => {
		let tempDeps = _.cloneDeep(deps);
		tempDeps[itemID].waitingIDs.splice(tempDeps[itemID].waitingIDs.indexOf(waitingID), 1);
		tempDeps[waitingID].blockingIDs.splice(tempDeps[waitingID].blockingIDs.indexOf(itemID), 1);
		let deepestWaitingLevel = getDeepestWaitingLevel(tempDeps, itemID)
		console.log(itemID,' new parent waiting level ', deepestWaitingLevel)
		tempDeps = getDepsWithItemMovedToLevel(tempDeps, itemID, deepestWaitingLevel + 1);
		return tempDeps;
	}
	const makeDependencyAction = (action, ...args) => {
		let tempDeps = _.cloneDeep(dependencies);
		tempDeps = action(tempDeps, ...args)
		setDependencies(tempDeps);
	}

	return {
		getDep,
		selectItem,
		makeDependencyAction,
		removeWaiting,
		selectedItem,
		dependencies,
		projectData,
		setProjectData
	}
}

const App = () => {
	const {
		getDep,
		selectItem,
		removeWaiting,
		makeDependencyAction,
		selectedItem,
		dependencies,
		projectData,
		setProjectData
	} = useDependencies();
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
											makeDependencyAction(removeWaiting, item.id, waitingID);
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
