const { API_TOKEN } = require('../.env.json');

export const getProjects = async () => {
	const rawData = await fetch("https://api.todoist.com/sync/v8/sync", {
		body: `token=${API_TOKEN}&sync_token=*&resource_types=[\"projects\"]`,
		headers: {
			"Content-Type": "application/x-www-form-urlencoded"
		},
		method: "POST"
	});
	const data = await rawData.json();
	console.log('Got Data: ', data)
	return data;
}
// AssetHierarchBuilder: 2241283254
export const getProjectData = async (projectID, cb) => {
	const rawData = await fetch("https://api.todoist.com/sync/v8/projects/get_data", {
		body: `token=${API_TOKEN}&project_id=${projectID}`,
		headers: {
			"Content-Type": "application/x-www-form-urlencoded"
		},
		method: "POST"
	});
	const data = await rawData.json();
	cb(data);
	return data;
}