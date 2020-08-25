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
export const getLabels = async () => {
	const rawData = await fetch("https://api.todoist.com/rest/v1/labels", {
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			"Authorization": `Bearer ${API_TOKEN}`
		},
		method: "GET"
	});
	const data = await rawData.json();
	return data;
}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
export const completeItem = async (itemId) => {
	const rawData = await fetch("https://api.todoist.com/sync/v8/sync", {
		body: `token=${API_TOKEN}&commands=[{\"type\": \"item_close\", \"uuid\": \"${uuidv4()}\", \"args\": {\"id\": ${itemId}}}]`,
		headers: {
			"Content-Type": "application/x-www-form-urlencoded"
		},
		method: "POST"
	})
	const data = await rawData.json();
	return data;
}
