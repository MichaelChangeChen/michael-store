# API 串接規則

此文件整理本專案 API 串接時的固定寫法，後續頁面開發請依此規則處理。

## Promise 寫法

1. API 一律使用 Promise chaining，不使用 `async/await`
2. 基本格式如下：

```js
someApi(data)
.then((res) => {
})
.catch((err) => {
})
.finally(() => {
});
```

## 排版規則

1. `.then(...)`、`.catch(...)`、`.finally(...)` 都要換行
2. `.then(...)`、`.catch(...)`、`.finally(...)` 要與 API 名稱對齊
3. 不另外多空一格，不做額外縮排變形

範例：

```js
someApi(data)
.then((res) => {
})
.catch((err) => {
})
.finally(() => {
});
```

## 參數命名規則

1. `.then((response) => ...)` 改成 `.then((res) => ...)`
2. `.catch((error) => ...)` 改成 `.catch((err) => ...)`

## 狀態判斷規則

1. 不要多宣告 `const responseData`、`const statusCode` 這類中間變數
2. 直接使用 `res.data.statusCode` 判斷
3. `statusCode` 可能是字串或數字時，統一使用以下方式：

```js
if([1, '1'].includes(res?.data?.statusCode)) {
	// Do Something
}
else {
	// Do Something
}
```

## 錯誤訊息規則

優先順序如下：

```js
err?.response?.data?.message || err?.message || '系統異常'
```

## Loading 規則

若頁面有使用 store 的 loading，統一寫法如下：

```js
setLoading(true);

someApi(data)
.then((res) => {
})
.catch((err) => {
})
.finally(() => {
	setLoading(false);
});
```

## Datatable 規則

若頁面有使用 `DatatableComponent`，分頁與每頁筆數優先統一使用 `datatableOptions` 處理，不另外拆成：

- `@update:page`
- `@update:itemsPerPage`

建議寫法：

```vue
<DatatableComponent
	@datatableOptions="onTableOptionsChange" />
```

```js
const onTableOptionsChange = (options) => {
	const nextPage = Number(options?.page) || 1;
	const nextPageSize = Number(options?.itemsPerPage) || 10;

	if(page.value === nextPage && pageSize.value === nextPageSize)
		return;

	page.value = nextPage;
	pageSize.value = nextPageSize;
	fetchList();
};
```

若後端規格沒有排序欄位，`datatableOptions` 可只處理：

- `page`
- `itemsPerPage`

## 範例

```js
apLogin(data)
.then((res) => {
	if([1, '1'].includes(res?.data?.statusCode)) {
		// Do Something
	}
	else {
		showNotice(res?.data?.message || '登入失敗', 'error', '錯誤');
	}
})
.catch((err) => {
	showNotice(err?.response?.data?.message || err?.message || '系統異常', 'error', '錯誤');
})
.finally(() => {
	setLoading(false);
});
```
