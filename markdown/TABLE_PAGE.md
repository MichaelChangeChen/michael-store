# TABLE_PAGE 開發規格

本文件以 `/system-permission-settings` 頁面為基準，整理出本專案未來新增「表格維護頁」時的共用規格。

目的：
- 統一頁面骨架
- 統一元件使用方式
- 統一 `vue / js / scss` 拆檔模式
- 讓新頁面可快速依樣套版開發

---

## 1. 適用範圍

適用於以下類型頁面：
- 有查詢條件的維護頁
- 有列表資料的管理頁
- 以表格為主體的 CRUD 頁面
- 使用 dialog 編輯資料的 table page

不適用：
- 單純左右樹狀編輯頁
- 高度客製化流程頁
- 多步驟 wizard 頁

---

## 2. 基本原則

開發時一律遵守：
- 以現有專案 `coding style` 為主
- 延續既有頁面視覺風格
- `vue / js / scss` 三檔分離
- 優先使用既有 component
- 沒有既有 component 時，使用 `Vuetify 3`
- 優先使用 `Vuetify 3` class，不額外堆 CSS
- 全專案時間格式統一為 `YYYY-MM-DD HH:mm:ss`

---

## 3. 檔案結構

新增一個 table page 時，標準檔案如下：

```text
src/pages/<module>/<PageName>.vue
src/js/<module>/<pageName>.js
src/css/<module>/<page-name>.scss
```

範例：

```text
src/pages/system/SystemPermissionSettings.vue
src/js/system/systemPermissionSettings.js
src/css/system/system-permission-settings.scss
```

---

## 4. 頁面標準骨架

標準頁面由 5 個區塊組成：

1. 頁首摘要卡
2. 查詢工具列
3. 資料列表區
4. 查詢條件側欄 `SearchBar`
5. 編輯與刪除 dialog
6. 只要有單獨出現按鈕時(搜尋/新增/...等等)，請出現此按鈕區塊。

標準結構：

```vue
<template>
	<section class="<page-name> d-flex flex-column ga-4">
		<v-card
			class="px-4 py-3"
			color="blue-lighten-5"
			rounded="lg"
			variant="flat"
			border>
			<div class="d-flex justify-space-between align-center flex-wrap ga-2">
				<div>
					<h2 class="text-h6 font-weight-bold"><頁面標題></h2>
					<p class="text-caption text-medium-emphasis mt-1"><頁面說明文字></p>
				</div>
				<v-chip
					rounded="pill"
					size="small"
					color="primary">
					共 {{ filteredItems.length }} 筆
				</v-chip>
			</div>
		</v-card>
		<v-card
			class="query-tools px-4 py-3"
			rounded="lg"
			variant="flat"
			border>
			<div class="d-flex justify-space-between align-center flex-wrap ga-2">
				<div class="d-flex align-center ga-2 flex-wrap">
					<!-- 查詢條件 chip -->
				</div>
				<div class="d-flex ga-2">
					<!-- 查詢 / 重設 / 新增按鈕 -->
				</div>
			</div>
		</v-card>

		<DatatableComponent ... />
		<SearchBar ... />
		<EditorDialog ... />
		<DeleteDialog ... />
	</section>
</template>

<script src="@/js/<module>/<pageName>.js"/>
<style scoped lang="scss">
	@import '@/css/<module>/<page-name>.scss';
</style>
```

---

## 5. 頁首摘要卡規格

用途：
- 呈現頁面標題
- 簡短說明頁面用途
- 顯示資料筆數摘要

固定樣式：
- 外層使用 `v-card`
- class 使用 `px-4 py-3`
- `color="blue-lighten-5"`
- `rounded="lg"`
- `variant="flat"`
- `border`

標準寫法：

```vue
<v-card
	class="px-4 py-3"
	color="blue-lighten-5"
	rounded="lg"
	variant="flat"
	border>
	<div class="d-flex justify-space-between align-center flex-wrap ga-2">
		<div>
			<h2 class="text-h6 font-weight-bold"><頁面標題></h2>
			<p class="text-caption text-medium-emphasis mt-1"><頁面說明></p>
		</div>
		<v-chip
			rounded="pill"
			size="small"
			color="primary">
			共 {{ filteredItems.length }} 筆
		</v-chip>
	</div>
</v-card>
```

---

## 6. 查詢工具列規格

用途：
- 顯示目前已套用的查詢條件
- 提供查詢條件按鈕
- 提供重設按鈕
- 提供新增按鈕

固定樣式：
- 使用 `v-card`
- class 包含 `query-tools px-4 py-3`
- 使用 `d-flex justify-space-between align-center flex-wrap ga-2`

條件顯示方式：
- 每個已生效條件用 `v-chip`
- 使用 `rounded="pill"`
- `size="x-small"`
- `label`
- 不要直接顯示空值

標準寫法：

```vue
<v-card
	class="query-tools px-4 py-3"
	rounded="lg"
	variant="flat"
	border>
	<div class="d-flex justify-space-between align-center flex-wrap ga-2">
		<div class="d-flex align-center ga-2 flex-wrap">
			<v-chip
				v-if="filters.keyword"
				rounded="pill"
				size="x-small"
				color="blue-lighten-2"
				label>
				名稱：{{ filters.keyword }}
			</v-chip>
		</div>
		<div class="d-flex ga-2">
			<BtnCompo
				@click="openSearchBar"
				name="查詢條件"
				setType="search"
				setIcon="mdi-filter-cog-outline" />
			<BtnCompo @click="resetFilters">重設</BtnCompo>
			<BtnCompo
				@click="openAddDialog"
				setType="add"
				name="新增<名稱以頁面功能為準>" />
		</div>
	</div>
</v-card>
```

---

## 7. 列表區規格

列表一律優先使用：
- `DatatableComponent`

1.列表內的編輯修改即刪除按鈕不需要tooltip，其他則依需求敘述為主。

表格欄位由 `tableHeaders` 控制，建議在 `js` 中定義：

```js
const tableHeaders = [
	{ title: '名稱', key: 'name', sortable: true },
	{ title: '狀態', key: 'status', sortable: true },
	{ title: '說明', key: 'description', sortable: false },
	{ title: '操作', key: 'btns', sortable: false }
];
```

標準寫法：

```vue
<DatatableComponent
	:headers="tableHeaders"
	:items="filteredItems"
	:total-items="filteredItems.length"
	:total-count="filteredItems.length"
	:is-disabled-sort="false"
	:current-page="1"
	:max-page="1"
	@update:page="onPageChange"
	@update:itemsPerPage="onPageSizeChange"
	@datatableOptions="onTableOptionsChange"
	item-key="id">
	<template #status="{ item }">
		<v-chip
			rounded="pill"
			size="small"
			label>
			{{ item.status }}
		</v-chip>
	</template>

	<template #btns="{ item }">
		<div class="d-flex align-center ga-2 flex-wrap">
			<BtnCompo
				@click="openEditDialog(item)"
				setType="edit"
				size="x-small"
				icon />
			<BtnCompo
				@click="openDeleteDialog(item)"
				setType="delete"
				size="x-small"
				icon />
		</div>
	</template>
</DatatableComponent>
```

---

## 8. SearchBar 規格

用途：
- 放查詢條件欄位
- 避免主畫面過度擁擠

查詢條件使用兩份資料：
- `filters`：實際生效條件
- `draftFilters`：SearchBar 編輯中的暫存條件

固定事件：
- `submitSearchBar`
- `resetSearchBar`
- `closeSearchBar`

標準寫法：

```vue
<SearchBar
	:isVisiable="searchBarVisible"
	@submitSearchBar="submitSearchBar"
	@resetSearchBar="resetSearchBar"
	@closeSearchBar="closeSearchBar">
	<v-col cols="12">
		<InputCompo v-model="<按照json格式，若無則自取欄位名稱>" mode="<按照給予需求>" label="名稱" />
	</v-col>
</SearchBar>
```

---

## 9. EditorDialog 規格

用途：
- 新增資料
- 修改資料

固定做法：
- 表單一律放在 `EditorDialog` 內
- 內容使用 `v-form`
- 是需求，或是必填加入 required, rules="[e => !!e || '此欄位為必填']"
- 欄位佈局使用 `v-row` + `v-col`
- 欄位輸入使用 `InputCompo`
- 新增或編輯完成跳出OperationNotice

EditorDialog 標準寫法：

```vue
<EditorDialog
	:isVisiable="dialogOpen"
	:title="editingId ? '修改資料' : '新增資料'"
	:submitDisabled="editorFormValid"
	@submitEditorDialog="saveItem"
	@cancelEditorDialog="closeDialog"
	submitString="送出"
	cancelString="取消"
	max-width="760px">
	<v-form
		v-model="editorFormValid"
		ref="editorForm"
		@submit.prevent
		class="d-flex flex-column ga-4">
		<v-row>
			<v-col cols="12" md="6">
				<InputCompo
					v-model="<依照json格式，若無則自取名稱>"
					mode="<按照給予需求>"
					<若是必填則給rules 及 required>
					label="名稱" />
			</v-col>
		</v-row>
	</v-form>
</EditorDialog>
```

---

## 10. DeleteDialog 規格

用途：
- 刪除前再次確認
- 顯示 1~3 筆重要欄位內容
- 刪除跳出OperationNotice

標準寫法：

```vue
<DeleteDialog
	:isVisiable="deleteDialogOpen"
	:item="deletingItem ? `名稱：${deletingItem.name}` : ''"
	:secItem="deletingItem ? `代碼：${deletingItem.code}` : ''"
	:thrItem="deletingItem ? `狀態：${deletingItem.status}` : ''"
	@submitDeleteDialog="submitDeleteDialog"
	@cancelDeleteDialog="closeDeleteDialog"
	title="確認刪除資料" />
```

---

## 11. InputCompo 使用規格

常用模式如下：

### 11.1 一般文字輸入

```vue
<InputCompo v-model="editor.name" label="名稱" />
```

### 11.2 下拉選單

```vue
<InputCompo
	v-model="editor.status"
	:items="statusOptions"
	mode="select"
	label="狀態" />
```

### 11.3 單選

```vue
<InputCompo
	v-model="editor.status"
	:items="statusOptions"
	mode="radio-group"
	label="狀態"
	inline />
```

### 11.4 多選

```vue
<InputCompo
	v-model="editor.groupIdList"
	:items="groupOptions"
	mode="checkbox-group"
	label="群組"
	inline />
```

### 11.5 文字區塊

```vue
<InputCompo
	v-model="editor.description"
	mode="textarea"
	label="說明"
	rows="3" />
```

### 11.6 日期

```vue
<InputCompo
	v-model="editor.effectiveDate"
	type="date"
	label="生效日期" />
```

---

## 12. BtnCompo 使用規格

固定優先使用 `BtnCompo`。

-若為列表內的按鈕則使用 icon size="x-small"

常用按鈕：

```vue

--列表外按鈕
<BtnCompo
	@click="openSearchBar"
	setType="search"
	name="查詢條件" />
<BtnCompo @click="resetFilters">重設</BtnCompo>
<BtnCompo
	@click="openAddDialog"
	setType="add"
	name="新增資料" />
<BtnCompo
	@click="saveItem"
	setType="save"
	name="儲存" />

--列表內按鈕
<BtnCompo
	@click="openEditDialog(item)"
	setType="edit"
	size="x-small"
	icon />
<BtnCompo
	@click="openDeleteDialog(item)"
	setType="delete"
	size="x-small"
	icon />
```

如果按鈕需要 tooltip：

```vue
<BtnCompo
	setType="edit"
	tooltip="編輯資料"
	icon />
```

---

## 13. JS 標準狀態設計

每個 table page 的 `js` 至少應包含：

```js
const searchBarVisible = ref(false);
const dialogOpen = ref(false);
const deleteDialogOpen = ref(false);
const editingId = ref(null);
const deletingItem = ref(null);
const editorForm = ref(null);
const editorFormValid = ref(false);

const items = ref([]);

const filters = reactive({
	keyword: '',
	status: '全部'
});

const draftFilters = reactive({
	keyword: '',
	status: '全部'
});

const editor = reactive({
	name: '',
	status: '啟用',
	description: ''
});
```

---

## 14. JS 標準方法清單

每個頁面建議具備以下方法：

### 查詢相關

```js
const syncDraftFromFilters = () => {};
const applyDraftToFilters = () => {};
const openSearchBar = () => {};
const closeSearchBar = () => {};
const submitSearchBar = () => {};
const resetSearchBar = () => {};
const resetFilters = () => {};
```

### 編輯 dialog 相關

```js
const resetEditor = () => {};
const syncEditorFormState = async () => {};
const openAddDialog = () => {};
const openEditDialog = (item) => {};
const closeDialog = () => {};
const saveItem = async () => {};
```

### 刪除相關

```js
const openDeleteDialog = (item) => {};
const closeDeleteDialog = () => {};
const submitDeleteDialog = () => {};
```

### 表格相關

```js
const onPageChange = async (nextPage) => {};
const onPageSizeChange = async (nextPageSize) => {};
const onTableOptionsChange = async (options) => {};
```

---

## 15. 驗證規格

必填欄位統一建議寫成：


其他規則：
- 若有數值欄位，須驗證最小值
- 若有日期欄位，須確認格式與是否必填
- 若有代碼欄位，須檢查重複
- 若有陣列輸入，須避免重複值

---

## 16. 樣式規格

SCSS 只補充頁面專屬差異，不重寫通用樣式。

建議寫法：

```scss
.page-name {
	.query-tools {
		background: linear-gradient(180deg, #ffffff 0%, #fafcff 100%);
	}

	&__description {
		display: inline-block;
		min-width: 220px;
		max-width: 380px;
		white-space: normal;
		line-height: 1.45;
	}
}
```

原則：
- 先用 Vuetify spacing / display class
- SCSS 只處理補充視覺
- 不要在頁面內堆大量客製 class

---

## 17. 新頁面開發流程

未來新增新的 table page 時，請照以下流程：

1. 建立 `vue / js / scss` 三個檔案
2. 先套用本文件的頁面骨架
3. 定義 `items / filters / draftFilters / editor`
4. 接上 `SearchBar / EditorDialog / DeleteDialog`
5. 再補實際欄位與業務規則
6. 最後接 API

---

---

## 18. 開發檢查清單

完成前請確認：

- 有依規則拆成 `vue / js / scss`
- 有頁首摘要卡
- 有查詢工具列
- 有 `SearchBar`
- 有 `DatatableComponent`
- 有 `EditorDialog`
- 有 `DeleteDialog`
- 有 `requiredRule`
- 有 `resetEditor`
- 有 `saveItem`
- 有 `submitDeleteDialog`
- 查詢條件有 `filters` 與 `draftFilters`
- 時間欄位格式符合 `YYYY-MM-DD HH:mm:ss`
- 優先使用既有 component 與 Vuetify class

---

## 20. 備註

若新頁面和 `/system-permission-settings` 差異過大，仍應先以本文件做基底，再按需求擴充，不要直接另起一套完全不同的 table page 結構。
