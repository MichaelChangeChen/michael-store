import axios from 'axios';

axios.defaults.timeout = 60000;
axios.defaults.withCredentials = true;

const 	resolveBaseUrl = 'https://ps-store-backend-uucr.onrender.com',
		request = axios.create({ baseURL: resolveBaseUrl });

export const getGameList = (params) => request.get("/getGameList", { params }),
addGame = (data) => request.post("/addGame", data),
updateGame = (data) => request.put("/updateGame", data),
deleteGame = (uuid) => request.delete(`/deleteGame/${uuid}`);


export {
	request,
	downloadBlob,
	uploadBlob,
	requestBlob,
	upload,
	requestMult,
	loginRequest
};
