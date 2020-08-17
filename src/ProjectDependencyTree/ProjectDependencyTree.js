import React, { useEffect } from "react";
import { getProjectData } from '../todoist_api_adapter';
import { useDependencies } from './hooks/useDependencies';
import './style.css';

export const ProjectDependencyTree = ({ PROJECT_ID }) => {
	const {
		getDep,
		selectItem,
		removeWaiting,
		makeDependencyAction,
		selectedItem,
		dependencies,
		projectData,
		setProjectData
	} = useDependencies({ PROJECT_ID });
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