import { ref } from 'vue';
import { defineStore } from "pinia";

export const useStore = defineStore('loading', () => {
	const
		isLoading = ref(false),
		isForm = ref(),
		setMenu = ref(JSON.parse(sessionStorage.getItem('authFuncMenu') || '[]')),
		defaultNotice = {
			isOpen: false,
			type: 'info',
			title: '',
			text: '',
			timeout: 2800
		},
		notice = ref({ ...defaultNotice });

	const
		showNotice = (	textOrOptions,
						type = 'info',
						title = '',
						timeout = 2800) => {
			const options = typeof textOrOptions === 'object' ? textOrOptions
								: { text: textOrOptions, type, title, timeout };

			if(!options?.text)
				return;

			notice.value = {
				...defaultNotice,
				...options,
				isOpen: true
			};
		},
		hideNotice = () => notice.value.isOpen = false,
		setMenuData = (menuList = []) => setMenu.value = Array.isArray(menuList) ? menuList : [],
		setLoading = boo => isLoading.value = boo,
		// getTK = callBack => {
		// 	getToken({})
		// 	.then(res => {
		// 		if(res.data.statusCode === '1')
		// 			callBack({ headers: { 	"Content-Type": "application/json",
		// 									Authorization: "Bearer " + res.data.authTn }});
		// 		else
		// 			showNotice(	res.status,
		// 						'error',
		// 						res.data.message);
		// 	})
		// 	.catch(err => {
		// 		showNotice(	err.message,
		// 					'error',
		// 					err.code);
		// 		console.log(err);
		// 		callBack(null);
		// 	});
		// },
		// downloadFiles = (	id,
		// 					callback) => {
		// 	getTK(auth => {
		// 		downloadFile(	id,
		// 						auth)
		// 		.then(res => {
		// 			if(res.status === 200)
		// 				callback(window.URL.createObjectURL(res.data), res.data);
		// 			else {
		// 				callback(null);
		// 				showNotice(	res.status,
		// 							'error',
		// 							'下載失敗');
		// 			};
		// 		})
		// 		.catch(err => {
		// 			showNotice(	err.message,
		// 						'error',
		// 						err.code);
		// 			console.log(err);
		// 			callback(null);
		// 		});
		// 	});
		// },
		// downloadFilesAsync = id =>
		// 	new Promise(resolve => downloadFiles(id, (url, data) => resolve({ url, data }))),
		// setFileUpload = (list = []) => {
		// 	for(const i of list) {
		// 		if(!i?.fileMetaId)
		// 			continue;

		// 		downloadFiles(i.fileMetaId, data => i.src = data || null);
		// 	};
		// },
		// saveDownload = (url,
		// 				data,
		// 				fileName = 'download',
		// 				fileType = 'text') => {
		// 	if(!url)
		// 		return;

		// 	if(data.type.includes('application/json')) {
		// 		data.text().then(text => {
		// 			let res = JSON.parse(text);
		// 			showNotice(	res.statusCode,
		// 						'error',
		// 						'系統異常');
		// 			console.log(res.message);
		// 		});
		// 		return;
		// 	};

		// 	const finalFileName = fileName?.includes('.') ? fileName : `${fileName}.${fileType}`;
		// 	const link = document.createElement('a');
		// 	link.href = url;
		// 	link.download = finalFileName;
		// 	document.body.appendChild(link);
		// 	link.click();
		// 	document.body.removeChild(link);
		// 	window.URL.revokeObjectURL(url);
		// 	showNotice(	`${fileName}.${fileType}`,
		// 				'success',
		// 				'下載成功');
		// },
		// handleDownload = async file => {
		// 	if(!file?.fileMetaId)
		// 		return;

		// 	setLoading(true);
		// 	try {
		// 		await new Promise(resolve => {
		// 			downloadFiles(	file.fileMetaId,
		// 							(url, data) => {
		// 								saveDownload(	url,
		// 												data,
		// 												file.showName,
		// 												file.fileExtension);
		// 								resolve();
		// 							});
		// 		});
		// 	}
		// 	finally {
		// 		setLoading(false);
		// 	};
		// },
		formatFileSize = size => {
			const bytes = Number(size);

			if(!Number.isFinite(bytes) || bytes < 0)
				return size;

			if(bytes < 1024 * 1024)
				return `${(bytes / 1024).toFixed(2)} KB`;

			return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
		};

	return {
		isForm,
		notice,
		setMenu,
		isLoading,
		setMenuData,
		setLoading,
		showNotice,
		hideNotice,
		// saveDownload,
		// downloadFiles,
		// setFileUpload,
		formatFileSize,
		// handleDownload,
		// downloadFilesAsync,
	};
});

export default useStore;
