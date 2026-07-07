# DEVELOPMENT_RULES

> 版本：1.0
> 更新日期：2026/05/13

---

## 基本原則

1. 開發前先看這份規則，再開始修改程式。
2. 已經存在的使用者調整、命名、文案，除非有明確需求，否則不要改回舊版本。
3. 送出前要自行檢查格式、命名與畫面行為。
4. 專案 UI 元件以 `Vuetify 3` 既有用法為主。
5. 日期時間格式統一使用 `YYYY-MM-DD HH:mm:ss`。

---

## JavaScript / Vue 撰寫規則

1. 結尾一定要有分號 `;`

```js
const name = 'Tom';
const list = [ aaa ];
```

2. `if` 為單行敘述時不要加大括號 `{}`

```js
if(flag)
	doSomething();
```

3. `object` 若內容小於三則，不換行

```js
aaa = { z: 1 };

aaa = { z: 1,
		a: 1 };
```

4. `object` 若內容達三則以上，改為多行

```js
aaa = {
	z: 1,
	a: 1,
	b: 1
};
```

5. `object` 與 `array` 括號內頭尾都要留空格

```js
aaa = { z: 1 };
bbb = [ aaa ];
```

6. 若資料結構已經很清楚，不要額外再包過多層 helper。

---

## Vue Template 屬性排序

1. Vue template 屬性排序順序如下：
   `v-if / v-for` -> `v-model` -> `v-bind` -> `v-on` -> 一般屬性 -> boolean 屬性
2. 同類型內依字串長度由長到短往下排。
3. 可單獨寫的 boolean 屬性，如 `readonly`、`disabled`、`inline`，放最後。
4. 若寫成 `:readonly="isReadonly"`，這算 `v-bind`，不算最後那種 boolean 屬性。

範例：

```vue
<InputCompo
	v-model="editor.status"
	:items="statusOptions.filter((item) => item.optionValue)"
	@update="updateStatus"
	itemTitle="optionText"
	itemValue="optionValue"
	mode="radio-group"
	label="狀態"
	inline />
```

---

## 元件與畫面規則

1. 可重用邏輯優先整理到共用元件或共用方法。
2. 不要無故重命名既有欄位、props、slots、events。
3. 使用 `Vuetify 3` 時，優先依官方 API 與專案既有模式實作。
4. UI 行為如 `selectable`、`readonly`、`disabled`、dialog submit 等，要先確認實際互動是否符合需求。

---

## 文案維護

1. 使用者已經手動調整過的頁籤、標題、按鈕、欄位名稱，預設視為最新版文案。
2. 未經確認，不要把既有文字改回舊版本。
3. 修改功能或重構檔案前，先比對目前畫面文案，避免把使用者已修正的名稱覆蓋掉。
4. 例如使用者把 `申請審核` 改成 `審核紀錄`，之後修改相關頁面時應保留 `審核紀錄`。

---

## 修改前提醒

1. 先確認目前檔案是不是已經被使用者手動調整過。
2. 若發現文案、命名、排序和過去版本不同，優先以目前版本為準。
3. 不要因為重構、複製別頁、或重寫檔案，就把使用者已修正的內容覆蓋掉。
