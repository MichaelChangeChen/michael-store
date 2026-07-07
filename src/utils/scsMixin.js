export default {
	data: () => ({
		countdown: null,
		timeOutProcessId: null,
		loginAuth: JSON.parse(window.sessionStorage.getItem('LoginAuth')),
		logoutTime: "",
		loginTimeout: 1800000,
		apiAuth: {},
		setSelectOptionsWithAll: {},
		codeMap: {
			'&apos;': '\'',
			'&quot;': '"',
			'&gt;': '>',
			'&lt;': '<'
		},
		textMap: {
			'\'': '&apos;',
			'"': '&quot;',
			'>': '&gt;',
			'<': '&lt;'
		},
		setSelectOptionss: {
			APPLY_STATUS: [],
			APPLY_PHASE: [],
			CHG_STATUS: [],
			EXT_STATUS: [],
			TYPE_APP_PHASE: [],
			TYPE_APP_STATUS: [],
			TYPE_CHG_PHASE: [],
			TYPE_CHG_STATUS: [],
			CHG_PHASE: [],
			// EXT_APP_TYPE: [],
			CHG_APP_TYPE: [],
			APP_TYPE: [],
			SOURCE: [],
			PAYMENT_STATUS: [],
			productKindOptions: [],
			nation: [],
			cum: [],
			TYPE_DOC_SIX: []
		},
	}),
	mounted() {
		this.apiAuth = {
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + this.getTokenWithSession(),
			},
		};
	},
	methods: {
		getTokenWithSession: function () {
			if(this.loginAuth?.id_token)
				return this.loginAuth.id_token;
		},
		abc() {
			console.log(123456567);
		},
		authValidate: function () {
			this.apiAuth = {
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + this.getTokenWithSession(),
				},
			};
			if (this.loginAuth === null) {
				this.$router.push({ path: "/" });
			}
			//判斷最後一次操作時間
			//console.log("time = " + (Date.now() - this.loginAuth.timeStart).toString());
			var timeDiff = Date.now() - this.loginAuth.timeStart;
			if (timeDiff >= this.loginTimeout) {
				alert("操作逾時");
				this.logout();
			} else {
				this.resetCountdown();
				this.loginAuth.timeStart = Date.now();
				window.sessionStorage.setItem('LoginAuth', JSON.stringify(this.loginAuth));
				this.initCountdown();
			}
		},
		clearCountdown: function () {
			clearInterval(this.countdown);
			this.countdown = null;
		},
		resetCountdown: function () {
			//記得在主頁面加上@click，轉換頁面時要使用@click.stop
			this.loginAuth.timeStart = Date.now();
			window.sessionStorage.setItem('LoginAuth', JSON.stringify(this.loginAuth));
		},
		initCountdown: function () {
			this.countdown = setInterval(() => {
				var nowTime = Date.now();
				var timeDiff = nowTime - this.loginAuth.timeStart;
				var deadline = this.loginAuth.timeStart + this.loginTimeout;
				if (timeDiff > this.loginTimeout) {
					clearInterval(this.countdown);
					this.countdown = null;
					alert("操作逾時");
					this.logout();
				} else {
					var offsetTime = (deadline - nowTime) / 1000; // ** 以秒為單位
					var sec = parseInt(offsetTime % 60); // 秒
					var min = parseInt((offsetTime / 60) % 60); // 分 ex: 90秒
					//console.log("countdown timeDiff = " + timeDiff + ", deadline = " + deadline + "," +  this.right("0" + min, 2) + ":" +  this.right("0" + sec, 2));
					this.logoutTime = this.right("0" + min, 2) + ":" + this.right("0" + sec, 2);
				}
			}, 1000);
		},
		toDownloadfile: function (id, name) {  //檔案下載
			let vm = this;
			var fileItem = {
				fileId: id,
				fileName: name,
			};
			vm.getApiToken("/file/upload/" + id, vm.fileDownload, fileItem);
		},
		fileDownload: function (token, fileItem) {
			/*
			傳入的格式如下
			var fileItem = {
			fileId: String,
			fileName: String,
			};
			*/
			var auth = {};
			if (typeof token === "undefined") {
				auth = {
					responseType: 'blob', //資料以二進制回傳
				};
			} else {
				auth = {
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + token
					},
					responseType: 'blob', //資料以二進制回傳
				};
			}
			getDownloadFile(auth, fileItem.fileId).then(function (response) {
				if ("200" == response.status) {
					var blob = new Blob([response.data]);
					const url = window.URL.createObjectURL(blob);
					const a = document.createElement('a');
					a.href = url;
					a.download = fileItem.fileName;
					//a.target = "_blank";
					a.click();
					setTimeout(() => URL.revokeObjectURL(url), 5000);
				}
			});
		},
		blobToDataURI(blob, callback) { //Blob to base64
			var reader = new FileReader();
			reader.onload = function (e) {
				var data = e.target.result;
				data = data.replace(/application/, "image");
				data = data.replace(/octet-stream/, "png");
				callback(data);
			}
			reader.readAsDataURL(blob);
		},
		dataURLtoBlob(dataurl) {
			var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
				bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
			while (n--) {
				u8arr[n] = bstr.charCodeAt(n);
			}
			return new Blob([u8arr], { type: mime });
		},
		right: function (str, num) {
			return str.substring(str.length - num, str.length)
		},
		formatTWDate(date, oldChar, newChar) { //西元年轉民國年格式
			if (!date) return null;
			if (date.split(oldChar).length === 3) {
				const [year, month, day] = date.split(oldChar);
				var yearStr = (parseInt(`${year}`) - 1911);
				return yearStr + `${newChar}${month}${newChar}${day}`;
			} else if (date.split(oldChar).length === 2) {
				const [year, month] = date.split(oldChar);
				var yearStr = (parseInt(`${year}`) - 1911);
				return yearStr + `${newChar}${month}`;
			} else {
				return date;
			}
		},
		dateTimeToDate: function (dateStr) {
			var vm = this;
			if (vm.isEmptyData(dateStr)) {
				return "";
			} else {
				if (dateStr.split(" ").length === 2) {
					const [date, time] = dateStr.split(" ");
					return date;
				} else {
					return dateStr;
				}
			}
		},
		dateToDateTime: function (dateStr, timeStr) {
			var vm = this;
			if (!!dateStr) {
				let tmpTime = (!!timeStr) ? timeStr :"00:00:00";
				return vm.dateTimeToDate(dateStr) + " " + tmpTime;
			} else {
				return "";
			}
		},
		dateTimeToTWDate: function (dateStr) {
			var vm = this;
			var date = vm.dateTimeToDate(dateStr);
			return (date != "") ? vm.formatTWDate(date.replace(/-/gi,"/"), "/", "/") : "";
		},
		dateTimeToTWDateTime: function (dateStr) {
			var vm = this;
			if (!!dateStr) {
				if (dateStr.split(" ").length === 2) {
					const [date, time] = dateStr.split(" ");
					return  vm.dateTimeToDate(dateStr) + " " + time;
				} else {
					return dateStr;
				}
			} else {
				return "";
			}
		},
		getTwYear(year) {  //v-date-picker 轉西元年顯示
			return "民國" + (year - 1911) + "年";
		},
		getTwHeaderDate(date) { //v-date-picker 轉西元年顯示
			var year = new Date(date).getFullYear();
			var returnVal = "民國" + (year - 1911) + "年 ";
			if (date.indexOf("-") > 0) {
				var month = new Date(date).getMonth() + 1;
				returnVal = returnVal + month + "月";
			}
			return returnVal;
		},
		getDataForPromise: function (funcs, callback) { //Api同步處理和Loading控制
			/*
				如果要傳入callback 呼叫端需要以以下寫法執行
				var callback = function() { .... };
				getDataForPromise(funcs, callback);
				否則callback不論有沒有傳值都會是undefined，且Promise的控制會全部失效。
				ex.可以參考ndtThirdPartyEdit.vue 的使用方式
			*/
			let vm = this;
			var funcArray = funcs;
			if (!Array.isArray(funcArray)) {
				funcArray = [funcs];
			}
			if (typeof callback !== "undefined") {
				Promise.all(funcArray)
				.then(callback)
				.catch(function (error) {
					console.log(error);
					vm.$swal(error);
					return;
				});
			}
			else {
				Promise.all(funcArray)
				.then(function () {
				})
				.catch(function (error) {
					console.log(error);
					vm.$swal(error);
					return;
				});
			}
		},
		apiGetData: function (api) {  //API 不帶參數共用
			var vm = this;
			return new Promise(function (resolve, reject) {
				api(vm.apiAuth).then(function (response) {
					if ("200" == response.status) {
						resolve(response.data);
					}
				}).catch(function (error) {
					vm.message = "連線逾時，請重新整理。";
					vm.$swal(vm.message);
					reject();
				});
			});
		},
		apiGetDataByPara: function (api, data) {  //API 有帶參數取值共用
			var vm = this;
			return new Promise(function (resolve, reject) {
				api(data, vm.apiAuth).then(function (response) {
					if ("200" == response.status || "201" == response.status) {
						resolve(response.data);
					}
				}).catch(function (error) {
					vm.message = "連線逾時，請重新整理。";
					vm.$swal(vm.message);
					reject();
				});
			});
		},
		apiDownLoadByPara: function (api, data, preview) {  //API 有帶參數取值共用
			var vm = this;
			var downloadAuth = vm.apiAuth;
			downloadAuth.responseType = 'blob';
			return new Promise(function (resolve, reject) {
				api(data, downloadAuth).then(function (response) {
					if ("200" == response.status) {
						if (response.headers['content-type'] == "application/force-download") {
							if (!!preview && preview) {
								resolve(new Blob([response.data], { type: 'application/pdf' }));
							} else {
								resolve(new Blob([response.data]));
							}
						} else {
							var reader = new FileReader();
							reader.readAsText(response.data, 'utf-8');
							reader.onload = function () {
								let tmpJson = JSON.parse(reader.result);
								reject(tmpJson.message);
							};
						}
					}
				}).catch(function (error) {
					vm.message = "連線逾時，請重新整理。";
					reject(vm.message);
				});
			});
		},
		isEmptyData: function (value) {
			if (typeof value === "undefined" || value === null) {
				return true;
			} else if (typeof value == "string") {
				if (value.trim().length == 0) {
					return true;
				}
			}
			return false;
		},
		getSelectOptionByCode: async function (code) {
			var vm = this;
			var obj = vm.getSelectOptions;
			var codeStr = code.replace(/\//gi, "_")
			if (vm.isEmptyData(obj[codeStr])) {
				const data1 = await vm.getSelectOptionByApi(code);
				obj = vm.getSelectOptions;
			}
			return obj[codeStr];
		},
		getSelectOptionByApi: async function (code) {
			var vm = this;
			await vm.apiGetDataByPara(getSelectOption, code).then(value => {
				if (value.statusCode == "1") {
					var obj = vm.getSelectOptions;
					var codeStr = code.replace(/\//gi, "_")
					obj[codeStr] = value.selectOption;
					vm.setSelectOptions(obj);
				}
			});
		},
		getSelectOptionPro(	url,
							callback) {
			getSelectOption(url,
							this.apiAuth)
			.then(res => {
				if(res.data.statusCode === '1')
					callback(res.data);
			}).catch(err => {});
		},
		getSystemOptionPro(	url,
							callback) {
			getSystemOption(url,
							this.apiAuth)
			.then(res => {
				if(res.data.statusCode === '1')
					callback(res.data);
			}).catch(err => {});
		},
		textToCode(text) {
			if(!text)
				return text;

			return text.replace(/['"><]/g, (match) => this.textMap[match]);
		},
		codeToText(code) {
			if(!code)
				return code;
			else
				if(Array.isArray(code)) {
					let text;
					code.forEach(e => text = (text ? text : '') + e + '\n');
					code = text;
				};

			return code.replace(/(&apos;|&quot;|&gt;|&lt;)/g, (match) => this.codeMap[match]);
		},
		async getUploadRealName(uploadFile,
								callBack,
								err) {
			let formData = new FormData(),
				setContentType = { ...this.apiAuth };
			setContentType.headers = { 	...setContentType.headers,
										...{ 'Content-Type': 'multipart/form-data' }};
			formData.append('file',
							uploadFile,
							uploadFile.name);

			await uploadData(	formData,
								setContentType)
			.then(res => {
				if(res.data.statusCode === '1')
					callBack(res.data.fileMetaList[0]);
				else
					err(res.data.message);
			})
			.catch(err => {
				console.log(err);
			});
		},
		setRules(	name,
					kind,
					noset,
					diy) {
			return [
				(value) => {
					if(diy && diy.length !== 0) {
						let status;
						diy.find(e => {
							if(e(value) !== true) {
								if(!this.submitDisabled.includes(name))
									this.submitDisabled.push(name);

								return status = e(value);
							}
							else {
								if(this.submitDisabled.indexOf(name) > -1)
									this.submitDisabled.splice(this.submitDisabled.indexOf(name), 1);
								status = true;
							};
						});
						return status;
					}
					else if(kind) {
						if (Array.isArray(value) ? value.length === 0 : !value) {
							if(!this.submitDisabled.includes(name))
								this.submitDisabled.push(name);
						}
						else
							if(this.submitDisabled.indexOf(name) > -1)
								this.submitDisabled.splice(this.submitDisabled.indexOf(name), 1);

						if(noset) {
							if(this.submitDisabled.indexOf(name) > -1)
								this.submitDisabled.splice(this.submitDisabled.indexOf(name), 1);
							return true;
						};

						if(kind === 'search')
							return !!value || '輸入【廠商統一編號】後，請按下查詢。';
						if(kind === 'input')
							return !!value || '請輸入內容。';
						if(kind === 'select')
							return !!value || '請選擇項目。';
						if(kind === 'pic')
							return !!value || '請選擇圖片。';
						if(kind === 'date')
							return !!value || '請選擇日期。';
					};
				}
			];
		},
	},
	destroyed() {
		this.clearCountdown();
	}
}