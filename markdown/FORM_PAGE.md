# FORM_PAGE 開發規格

本專案未來新增「表單型頁面」時的共用規格。

用途：
- 統一申請單 / 填報單 / 異動單頁面的版型
- 統一欄位區塊切分方式
- 統一 `vue / js / scss` 拆檔模式
- 讓後續新表單頁可以直接照此規格快速開發

---

## 1. 適用範圍

適用頁型：
- 單筆送單頁
- 申請單頁
- 異動單頁
- 需要大量欄位輸入的表單頁
- 依勾選條件顯示不同表單區塊的頁面

不適用頁型：
- 以列表為主的 CRUD 維護頁
- 以表格查詢為主的管理頁
- 左右樹狀編輯頁

如果是列表維護頁，應改參考 `TABLE_PAGE.md`。

---

## 2. 基本原則

開發時一律遵守：
- 以目前專案既有 `coding style` 為主
- 延續現有頁面視覺風格
- `vue / js / scss` 三檔分離
- 表單類型一律以 component 化方式開發，方便被路由頁、`ApplyMainPage`、`MyForms`、`FullPageDialog` 重複使用
- 優先使用既有 component
- 沒有既有 component 時，使用 `Vuetify 3`
- 優先使用 `Vuetify 3` class，不額外堆疊不必要 CSS
- 全專案時間格式統一為 `YYYY-MM-DD HH:mm:ss`

---

## 3. 檔案結構

新增一個表單 component 時，標準檔案如下：

```text
src/pages/<module>/<PageName>.vue
src/js/<module>/<pageName>.js
src/css/<module>/<page-name>.scss
```

範例：

```text
src/pages/forms/ModifyForm.vue
src/js/forms/modifyForm.js
src/css/forms/modify-form.scss
```

原則：
- 表單本體應可被路由頁直接顯示，也可被 `FullPageDialog` 直接嵌入。
- 不要把表單邏輯寫在 `ApplyMainPage` 或 `MyForms`，表單自己的送出、暫存、重填、退件邏輯都留在表單 component 的 JS 內。

---

## 4. 頁面標準骨架

以 `/modify-form` 來看，標準表單頁由以下區塊構成：

1. `v-form` 從最外層包住頁首摘要卡、表單主卡與底部操作按鈕
2. 頁首摘要卡，使用 `form-top-sticky`
3. 表單主卡
4. 退件提示區塊
5. 表單內容區使用 `div class="pa-4 d-flex flex-column ga-4"` 包住多個 `section`
6. 每個 `section` 內使用 `v-row / v-col`
7. 視條件顯示的附加區塊
8. 頁尾操作按鈕區放在 `v-form` 最後，使用 `form-bottom-sticky`

標準結構：

```vue
<template>
	<div class="page-form">
		<v-form
			ref="form"
			class="d-flex flex-column ga-4"
			@submit.prevent="submitForm">
			<v-card
				class="px-4 py-3 form-top-sticky"
				color="blue-lighten-5"
				rounded="lg"
				variant="flat"
				border>
				<div class="d-flex justify-space-between flex-wrap ga-2 align-center">
					<h2 class="text-h6 font-weight-bold"><表單標題></h2>
					<div class="d-flex ga-2">
						<v-chip
							rounded="pill"
							size="small"
							color="blue-lighten-1">
							<表單代碼>
						</v-chip>
						<BtnCompo
							setType="print"
							name="列印申請單"
							size="small"/>
					</div>
				</div>
			</v-card>
			<v-card
				rounded="lg"
				variant="flat"
				border>
				<div v-if="isReturnMode" class="d-flex align-start ga-3 px-4 pt-4">
					<v-icon color="red-darken-2" size="large">mdi-alert-circle-outline</v-icon>
					<div>
						<div class="text-subtitle-1 font-weight-bold text-red-darken-2">退件重填</div>
						<div class="text-body-2 text-red-darken-2">退回資訊：退回者：表單承辦人 / 日期：2026-3-9 / 原因：資料不足</div>
					</div>
				</div>
				<div class="pa-4 d-flex flex-column ga-4">
					<section>
						<p class="section-title">區塊標題</p>
						<v-row>
							<v-col cols="12" md="6">
								<InputCompo v-model="inputs.fieldA" label="欄位A" />
							</v-col>
						</v-row>
					</section>
				</div>
			</v-card>
			<v-card
				class="px-4 py-3 form-bottom-sticky d-flex justify-end ga-2"
				color="blue-lighten-5"
				rounded="lg"
				variant="flat"
				border>
				<BtnCompo color="pink" name="取消" />
				<BtnCompo
					variant="tonal"
					color="warning"
					name="暫存" />
				<BtnCompo
					@click="onReset"
					variant="tonal"
					name="重填" />
				<BtnCompo
					type="submit"
					variant="elevated"
					name="送出申請"
					setType="save"
					setIcon=" " />
			</v-card>
		</v-form>
	</div>
</template>

<script src="@/js/<module>/<pageName>.js"/>
<style scoped lang="scss">
	@import '@/css/<module>/<page-name>.scss';
</style>
```

---

## 5. 頁首摘要卡規格

用途：
- 顯示表單名稱
- 顯示表單代碼

標準樣式：
- `v-card`
- `class="px-4 py-3"`
- `color="blue-lighten-5"`
- `rounded="lg"`
- `variant="flat"`
- `border`

標準寫法：

```vue
<v-card
	class="px-4 py-3 form-top-sticky"
	color="blue-lighten-5"
	rounded="lg"
	variant="flat"
	border>
	<div class="d-flex justify-space-between flex-wrap ga-2 align-center">
		<h2 class="text-h6 font-weight-bold">表單標題</h2>
		<div class="d-flex ga-2">
			<v-chip
				rounded="pill"
				size="small"
				color="blue-lighten-1">
				<表單代碼>
			</v-chip>
			<BtnCompo
				setType="print"
				name="列印申請單"
				size="small"/>
		</div>
	</div>
</v-card>
```

頁首摘要卡應放在 `v-form` 內，讓整份表單 component 可被 `FullPageDialog` 直接嵌入，並由表單自身控制 sticky。
---

## 6. 表單主卡規格

表單內容一律包在主卡內：

```vue
<v-form
	ref="form"
	class="d-flex flex-column ga-4"
	@submit.prevent="submitForm">
	<v-card class="px-4 py-3 form-top-sticky" ...>
		...
	</v-card>

	<v-card
		rounded="lg"
		variant="flat"
		border>
		<div class="pa-4 d-flex flex-column ga-4">
			...
		</div>
	</v-card>

	<v-card class="px-4 py-3 form-bottom-sticky d-flex justify-end ga-2" ...>
		...
	</v-card>
</v-form>
```

原則：
- 主卡負責承載整份表單
- `v-form` 必須從表單最外層包住頁首摘要卡、主表單卡與底部操作按鈕
- 主卡內另用 `div class="pa-4 d-flex flex-column ga-4"` 控制內容間距
- 區塊靠 `section` 分段，不要每個區塊都拆成獨立頁卡
- 保持單一閱讀流
- 底部操作按鈕若放在 `v-form` 內，`type="submit"` 可直接觸發 `@submit.prevent="submitForm"`
- 因表單會被 `FullPageDialog` 直接嵌入，頁首摘要卡與底部操作卡都由表單 component 自己管理

---

## 7. 退件模式規格

此區塊不是每張表單都必須實作。只有當表單需要支援「退回申請人後重新填寫」時，才需要加入 `isReturnMode`、`returnReason`、`submitReturnForm`、`revokeReturnForm` 等退件相關狀態與方法。

目前表單會以 component 方式放進 `FullPageDialog`，因此退件模式建議由父層傳入 `mode`，表單 component 自己判斷是否顯示重新填寫區塊。

若需要退件重填，建議包含：
- `isReturnMode`
- `returnReason`
- `requiredRule`
- `submitReturnForm`
- `revokeReturnForm`
- `closeForm`

標準 UI：

```vue
<div v-if="isReturnMode" class="d-flex align-start ga-3 px-4 pt-4">
	<v-icon color="red-darken-2" size="large">mdi-alert-circle-outline</v-icon>
	<div>
		<div class="text-subtitle-1 font-weight-bold text-red-darken-2">退件重填</div>
		<div class="text-body-2 text-red-darken-2">退回資訊：退回者：表單承辦人 / 日期：2026-3-9 / 原因：資料不足</div>
	</div>
</div>
```

JS 範例：

```js
props: {
	mode: {
		type: String,
		default: ''
	}
},
emits: ['close'],
setup(props, { emit }) {
	const returnReason = ref('');
	const isReturnMode = computed(() => props.mode === 'return');

	const closeForm = () => {
		emit('close');
	};

	const submitReturnForm = () => {};
	const revokeReturnForm = () => {};

	return {
		isReturnMode,
		returnReason,
		closeForm,
		submitReturnForm,
		revokeReturnForm
	};
}
```

---

## 8. section 分段規格

每一大區塊一律使用：
- `section`
- 區塊標題 `<p class="section-title">`
- 內容使用 `v-row / v-col`

標準寫法：

```vue
<section>
	<p class="section-title">申請人資訊</p>
	<v-row>
		<v-col cols="12" lg="4" sm="6">
			<InputCompo v-model="inputs.applicantName" label="申請人" />
		</v-col>
	</v-row>
</section>
```

優點：
- 視覺清楚
- 可快速掃描
- 可控欄位密度

---

## 9. 欄位排版規格

以 `/modify-form` 為準，常用欄位寬度：

- `cols="12"`：手機版全寬
- `sm="6"`：中小欄位
- `md="6"`：雙欄
- `lg="3"`：四欄
- `lg="4"`：三欄

建議使用原則：

- 基本資訊欄位：`lg="4" sm="6"`
- 一般輸入欄位：`md="6"`
- 長文字或說明欄：`cols="12"`
- checkbox / radio 群組：`cols="12"`

---

## 10. InputCompo 使用規格

表單欄位一律優先使用 `InputCompo`。

### 10.1 唯讀欄位

```vue
<InputCompo :modelValue="value" label="欄位名稱" disabled />
```

### 10.2 一般文字輸入

```vue
<InputCompo v-model="inputs.fieldName" label="欄位名稱" />
```

### 10.3 日期欄位

```vue
<InputCompo
	v-model="inputs.planStart"
	type="date"
	label="預計開始日期" />
```

### 10.4 電子郵件

```vue
<InputCompo
	v-model="inputs.email"
	type="email"
	label="Email" />
```

### 10.5 多選 checkbox-group

```vue
<InputCompo
	v-model="inputs.changeItems"
	mode="checkbox-group"
	:items="changeItemOptions"
	label="異動項目"
	inline />
```

### 10.6 單選 radio-group

```vue
<InputCompo
	v-model="checklist[item.id].answer"
	mode="radio-group"
	:items="evaluationOptions"
	label="評估結果"
	inline />
```

### 10.7 多行文字

```vue
<InputCompo
	v-model="inputs.comment"
	mode="textarea"
	label="說明"
	rows="3" />
```

---

## 11. 動態顯示區塊規格

表單頁常見情境是依勾選結果顯示不同區塊。

以 `/modify-form` 的作法，建議：
- 用 `v-if`
- 條件直接判斷 `inputs.xxx.includes(...)`
- 每個條件區塊仍保持 `section` 結構

標準寫法：

```vue
<section v-if="Array.isArray(inputs.changeItems) && inputs.changeItems.includes('某項目')">
	<p class="section-title">附加區塊標題</p>
	<v-row>
		...
	</v-row>
</section>
```

原則：
- 條件顯示只控制區塊顯示，不應破壞原表單結構
- 不要把過多商業邏輯寫在 template，複雜條件可改寫成 computed

---

## 12. 清單式檢核區塊規格

若頁面有檢核題、稽核題、評估題，建議依 `/modify-form` 的模式：

- `checklistSections`：描述題目群組
- `checklist`：保存答案與說明

資料結構：

```js
const checklistSections = [
	{
		title: '完整性',
		items: [
			{ id: 'integrity-1', text: '題目內容' }
		]
	}
];

const checklist = reactive({
	'integrity-1': {
		answer: '',
		comment: ''
	}
});
```

畫面寫法：

```vue
<v-col v-for="section in checklistSections" cols="12" md="6">
	<v-card class="px-4 py-3 h-100" rounded="lg" variant="flat" border>
		<h3 class="mb-3 text-center">{{ section.title }}</h3>
		<div v-for="(item, index) in section.items">
			<v-row>
				<v-col cols="12" class="py-1 mt-5 text-body-2">
					{{ index + 1 }}. {{ item.text }}
				</v-col>
				<v-col cols="12" lg="4" class="py-2">
					<InputCompo
						v-model="checklist[item.id].answer"
						:items="evaluationOptions"
						mode="radio-group"
						label="評估結果"
						inline />
				</v-col>
				<v-col cols="12" lg="8" class="py-2">
					<InputCompo
						v-model="checklist[item.id].comment"
						mode="textarea"
						label="說明"
						rows="3" />
				</v-col>
			</v-row>
		</div>
	</v-card>
</v-col>
```

---

## 13. 動態列資料規格

若頁面需要可新增/刪除的重複資料列，建議依 `/modify-form` 的 DNS 區塊模式：

```js
const createRow = () => ({
	fieldA: '',
	fieldB: ''
});

const createRows = () => Array.from({ length: 1 }, () => createRow());

const inputs = reactive({
	rows: createRows()
});

const addRow = () => {
	inputs.rows.push(createRow());
};

const removeRow = (index) => {
	if(inputs.rows.length <= 1) {
		showNotice('至少需保留一筆', 'warning', '提醒');
		return;
	}
	inputs.rows.splice(index, 1);
};
```

原則：
- 至少保留一筆
- 新增與刪除邏輯寫在 `js`
- UI 使用同一套 row card 或 row layout

---

## 14. JS 標準狀態設計

每個表單頁的 `js` 至少應包含：

```js
const form = ref(null);

const inputs = reactive({
	fieldA: '',
	fieldB: '',
	fieldC: []
});
```

若有退件模式：

```js
const {
	isReturnMode,
	returnInfoText,
	returnReason,
	requiredRule,
	goBackToMyForms
} = createReturnFormState();
```

若沒有退件模式，也應至少具備：

```js
const requiredRule = (label) => [
	(value) => Boolean(String(value ?? '').trim()) || `${label}為必填`
];
```

---

## 15. JS 標準方法清單

每個表單頁建議具備以下方法：

```js
const submitForm = async () => {};
const onReset = () => {};
```

若有退件模式，再補：

```js
const submitReturnForm = () => {};
const revokeReturnForm = () => {};
```

若有動態列，再補：

```js
const addRow = () => {};
const removeRow = (index) => {};
```

若有檢核題，再補：

```js
const initChecklistAnswers = () => {};
```

---

## 16. 驗證規格

表單頁一律透過 `v-form` 驗證。

送出前標準流程：

```js
const submitForm = async () => {
	const { valid } = await form.value.validate();
	if(!valid) {
		showNotice('請先完成必填欄位', 'warning', '提醒');
		return;
	}

	showNotice('表單已送出', 'success', '完成');
};
```

常見驗證：
- 必填欄位
- checkbox 至少勾一項
- `其他` 被勾選時需填補充文字
- 至少保留一筆明細資料
- 日期欄位格式正確

---

## 17. 樣式規格

表單頁專屬樣式應集中在 `<page-name>.scss`。

以 `/modify-form` 為準，至少保留：

```scss
.page-form {
}
```

原則：
- 不要大量客製元件樣式
- 優先用 Vuetify class
- SCSS 只處理區塊標題、少量 card 外觀、特殊區塊補充樣式
- 表單頁會以 component 方式放入 `FullPageDialog`，標題卡使用 `form-top-sticky` 固定上方，底部按鈕卡使用 `form-bottom-sticky` 固定下方，已經在hyboot-variables.scss 內寫到

---

## 18. 操作按鈕區規格

表單頁底部通常需要：
- 送出
- 清除 / 重設
- 退件重送
- 撤銷
- 返回

建議使用 `BtnCompo`，若頁面既有風格沒使用，也應先對照現有實作。

標準範例：

```vue
<v-card
	class="px-4 py-3 form-bottom-sticky d-flex justify-end ga-2"
	color="blue-lighten-5"
	rounded="lg"
	variant="flat"
	border>
	<BtnCompo color="pink" name="取消" />
	<BtnCompo
		variant="tonal"
		color="warning"
		name="暫存" />
	<BtnCompo
		@click="onReset"
		variant="tonal"
		name="重填" />
	<BtnCompo
		type="submit"
		variant="elevated"
		name="送出申請"
		setType="save"
		setIcon=" " />
</v-card>
```

---

## 19. 快速模板

以下模板可直接複製後開發新表單頁：

```vue
<template>
	<div class="page-form">
		<v-form
			ref="form"
			class="d-flex flex-column ga-4"
			@submit.prevent="submitForm">
			<v-card
				class="px-4 py-3 form-top-sticky"
				color="blue-lighten-5"
				rounded="lg"
				variant="flat"
				border>
				<div class="d-flex justify-space-between flex-wrap ga-2 align-center">
					<h2 class="text-h6 font-weight-bold">表單標題</h2>
					<div class="d-flex ga-2">
						<v-chip
							rounded="pill"
							size="small"
							color="blue-lighten-1">
							<表單代碼>
						</v-chip>
						<BtnCompo
							setType="print"
							name="列印申請單"
							size="small"/>
					</div>
				</div>
			</v-card>
			<v-card
				rounded="lg"
				variant="flat"
				border>
				<div class="pa-4 d-flex flex-column ga-4">
					<section>
						<p class="section-title">基本資料</p>
						<v-row>
							<v-col cols="12" md="6">
								<InputCompo v-model="inputs.fieldA" label="欄位A" />
							</v-col>
							<v-col cols="12" md="6">
								<InputCompo v-model="inputs.fieldB" label="欄位B" />
							</v-col>
						</v-row>
					</section>
				</div>
			</v-card>
			<v-card
				class="px-4 py-3 form-bottom-sticky d-flex justify-end ga-2"
				color="blue-lighten-5"
				rounded="lg"
				variant="flat"
				border>
				<BtnCompo color="pink" name="取消" />
				<BtnCompo
					variant="tonal"
					color="warning"
					name="暫存" />
				<BtnCompo
					@click="onReset"
					variant="tonal"
					name="重填" />
				<BtnCompo
					type="submit"
					variant="elevated"
					name="送出申請"
					setType="save"
					setIcon=" " />
			</v-card>
		</v-form>
	</div>
</template>
```

---

## 20. 開發檢查清單

完成前請確認：

- 已拆成 `vue / js / scss`
- 表單本體可作為 component 被 `FullPageDialog` 直接嵌入
- `v-form` 從最外層包住頁首摘要卡、主表單卡、底部操作按鈕
- 有頁首摘要卡，且使用 `form-top-sticky`
- 有主表單卡
- 主表單卡內有 `div class="pa-4 d-flex flex-column ga-4"` 包住各 `section`
- 每個大區塊使用 `section`
- 區塊標題使用 `section-title`
- 欄位使用 `InputCompo`
- 版面使用 `v-row / v-col`
- 有 `submitForm`
- 有 `requiredRule` 或共用驗證
- 底部操作按鈕使用 `form-bottom-sticky`，若放在 dialog 中仍能固定於可視區底部
- SCSS 已設定 `.content-card { overflow: visible; }`，避免 sticky 被裁切
- 若需要重新填寫功能，才實作 `isReturnMode`、`returnReason`、`submitReturnForm`、`revokeReturnForm`
- 若有條件區塊，已用 `v-if` 明確控制
- 若有動態列，至少保留一筆
- 時間格式符合 `YYYY-MM-DD HH:mm:ss`

---

## 21. 備註

若新頁面屬於「申請/填報/異動單」型態，應優先照本文件開發。

若頁面主體是列表、查詢、CRUD 表格，則應改參考 `TABLE_PAGE.md`，不要混用兩種頁型結構。
