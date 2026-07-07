<template>
	<!--
	InputCompo 使用說明（Vuetify 3）
	1) 一般文字輸入（預設 mode=text）
	<InputCompo v-model="form.keyword" label="關鍵字" clearable />

	2) 日期 / 時間
	<InputCompo v-model="form.date" type="date" label="日期" />
	<InputCompo v-model="form.time" type="time" label="時間" />
	<InputCompo v-model="form.startAt" type="datetime-local" label="開始日期時間" />

	3) 多行輸入
	<InputCompo v-model="form.note" mode="textarea" label="備註" :rows="4" auto-grow />

	4) 下拉選單
	<InputCompo
		v-model="form.floor"
		mode="select"
		:items="floorOptions"
		label="樓層"
		item-title="title"
		item-value="value"
	/>

	5) 下拉選單，可自行輸入
	<InputCompo
		v-model="form.name"
		mode="combobox"
		:items="nameOptions"
		label="姓名"
		clearable
	/>

	6) 單一核取方塊
	<InputCompo v-model="form.agree" mode="checkbox" label="我同意條款" />

	7) 核取方塊群組（回傳 Array）
	<InputCompo
		v-model="form.tags"
		mode="checkbox-group"
		label="標籤"
		:items="['A', 'B', 'C']"
	/>

	8) 單選群組
	<InputCompo
		v-model="form.level"
		mode="radio-group"
		label="風險等級"
		:items="['低', '中', '高']"
		inline
	/>

	9) 事件
	- v-model: update:modelValue
	- click:clear
	- click:append-inner
	- keyupEnter（相容舊專案）
	-->
	<div :class="['input-compo', wrapperClass, className, `${mode}__compo d-flex flex-column ga-2`]">
		<div v-if="isReadonly" class="d-flex align-center ga-2 flex-wrap pt-2">
			<strong class="text-grey-darken-2">{{ label }}：</strong>
			<span v-if="isFileInput">
				<v-chip v-for="item in localValue" :key="item.name">{{ item.name }}</v-chip>
			</span>
			<span
				v-else-if="mode === 'radio-group'"
				class="flex-grow-1 text-center text-grey-darken-1 border-b">
				{{ checkRadioValue(localValue) }}
			</span>
			<span v-else class="flex-grow-1 text-center text-grey-darken-1 border-b">{{ localValue }}</span>
		</div>
		<v-input
			v-else-if="mode === 'checkbox-group' || mode === 'checkbox'"
			:model-value="localValue"
			:rules="rules"
			:messages="messages"
			:error-messages="errorMessages"
			:error="error"
			:hide-details="resolvedHideDetails"
			:disabled="disabled"
			class="input-compo__field h-100">
			<div
				v-if="mode === 'checkbox-group'"
				:style="groupStyle"
				:class="{ 'input-compo__group--inline': inline }"
				class="input-compo__group">
				<p v-if="displayLabel" class="input-compo__group-label">{{ displayLabel }}</p>
				<div class="input-compo__group-list">
					<v-checkbox
						v-for="item in normalizedItems"
						v-model="localValue"
						:key="`checkbox-${item.value}`"
						:label="item.label"
						:value="item.value"
						:density="density"
						:color="color"
						:base-color="baseColor"
						:hide-details="resolvedHideDetails"
						:disabled="item.disabled || disabled"
						class="input-compo__selection"/>
					<slot />
				</div>
			</div>
			<div
				v-else
				:style="groupStyle"
				class="input-compo input-compo__group">
				<v-checkbox
					v-model="localValue"
					v-bind="$attrs"
					:label="label"
					:density="density"
					:color="color"
					:base-color="baseColor"
					:hide-details="resolvedHideDetails"
					:disabled="disabled"
					:readonly="readonly"
					:true-value="trueValue"
					:false-value="falseValue"
					:value="value"
					:messages="messages"
					:error-messages="errorMessages"
					:error="error"
					class="input-compo__field input-compo__selection"/>
					<slot />
			</div>
		</v-input>
		<v-radio-group
			v-else-if="mode === 'radio-group'"
			v-model="localValue"
			v-bind="$attrs"
			:label="displayLabel"
			:color="color"
			:base-color="baseColor"
			:density="density"
			:inline="inline"
			:hide-details="resolvedHideDetails"
			:disabled="disabled"
			:readonly="readonly"
			:style="groupStyle"
			:messages="messages"
			:error-messages="errorMessages"
			:error="error"
			:rules="rules"
			class="input-compo__field input-compo__selection h-100">
			<v-radio
				v-for="item in normalizedItems"
				:key="`radio-${item.value}`"
				:label="item.label"
				:base-color="baseColor"
				:value="item.value"
				:disabled="item.disabled || disabled"/>
		</v-radio-group>
		<v-date-input
			v-else-if="mode === 'text' && type === 'date'"
			v-model="datePickerValue"
			v-bind="$attrs"
			:display-format="dateInputDisplayFormat"
			:label="displayLabel"
			:variant="variant"
			:flat="flat"
			:single-line="singleLine"
			:density="density"
			:rounded="rounded"
			:color="color"
			:base-color="baseColor"
			:bg-color="bgColor"
			:validate-on="validateOn"
			:hint="hint"
			:persistent-hint="persistentHint"
			:hide-details="resolvedHideDetails"
			:clearable="clearable"
			:clear-icon="clearIcon"
			:readonly="readonly"
			:disabled="disabled"
			:id="id || undefined"
			:name="name || undefined"
			:placeholder="placeholder"
			:min="min"
			:max="max"
			:messages="messages"
			:error-messages="errorMessages"
			:max-errors="maxErrors"
			:loading="loading"
			:error="error"
			:rules="rules"
			class="input-compo__field date-input"
			@click:clear="onClear"
			@focus="onFocus"
			@blur="onBlur"
			@update:focused="onUpdateFocused"
			prependInnerIcon="mdi-calendar"
			prependIcon=""/>
		<v-file-input
			v-else-if="isFileInput"
			v-model="localValue"
			v-bind="$attrs"
			:label="displayLabel"
			:variant="variant"
			:flat="flat"
			:single-line="singleLine"
			:density="density"
			:rounded="rounded"
			:color="color"
			:base-color="baseColor"
			:bg-color="bgColor"
			:validate-on="validateOn"
			:hint="hint"
			:persistent-hint="persistentHint"
			:hide-details="resolvedHideDetails"
			:clearable="clearable"
			:clear-icon="clearIcon"
			:multiple="multiple"
			:chips="chips"
			:readonly="readonly"
			:disabled="disabled"
			:id="id || undefined"
			:name="name || undefined"
			:placeholder="placeholder"
			:prepend-icon="prependIcon || ''"
			:append-icon="appendIcon || ''"
			:prepend-inner-icon="prependInnerIcon || 'mdi-paperclip'"
			:append-inner-icon="appendInnerIcon || ''"
			:messages="messages"
			:error-messages="errorMessages"
			:max-errors="maxErrors"
			:loading="loading"
			:error="error"
			:rules="rules"
			class="input-compo__field input-compo__file"
			@click:clear="onClear"
			@click:append-inner="onClickAppend"
			@focus="onFocus"
			@blur="onBlur"
			@update:focused="onUpdateFocused">
			<template #selection="{ fileNames }">
				<div v-if="chips" class="d-flex align-center flex-wrap ga-1">
					<v-chip
						v-for="fileName in fileNames"
						:key="fileName"
						color="primary"
						size="small"
						variant="tonal">
						{{ fileName }}
					</v-chip>
				</div>
				<span v-else>{{ fileNames.join(', ') }}</span>
			</template>
		</v-file-input>
		<div v-else-if="mode === 'text' && type === 'datetime-local'" class="input-compo__datetime d-flex ga-2">
			<v-date-input
				v-model="dateTimeDateValue"
				v-bind="$attrs"
				:display-format="dateInputDisplayFormat"
				:label="displayLabel"
				:variant="variant"
				:flat="flat"
				:single-line="singleLine"
				:density="density"
				:rounded="rounded"
				:color="color"
				:base-color="baseColor"
				:bg-color="bgColor"
				:validate-on="validateOn"
				:hint="hint"
				:persistent-hint="persistentHint"
				:hide-details="resolvedHideDetails"
				:clearable="clearable"
				:clear-icon="clearIcon"
				:readonly="readonly"
				:disabled="disabled"
				:id="id || undefined"
				:name="name || undefined"
				:placeholder="placeholder"
				:min="min"
				:max="max"
				:messages="messages"
				:error-messages="errorMessages"
				:max-errors="maxErrors"
				:loading="loading"
				:error="error"
				:rules="rules"
				class="input-compo__field date-input"
				@click:clear="onClear"
				@focus="onFocus"
				@blur="onBlur"
				@update:focused="onUpdateFocused"
				prependInnerIcon="mdi-calendar"
				prependIcon=""/>
			<v-select
				v-model="dateTimeTimeValue"
				:items="timeOptions"
				label="時段"
				:variant="variant"
				:flat="flat"
				:single-line="singleLine"
				:error="error"
				:rules="rules"
				:density="density"
				:rounded="rounded"
				:color="color"
				:base-color="baseColor"
				:bg-color="bgColor"
				:hide-details="resolvedHideDetails"
				:readonly="readonly"
				:disabled="disabled"
				class="input-compo__field input-compo__datetime-time" />
		</div>
		<component
			v-else
			:is="inputTag"
			v-model="localValue"
			v-bind="$attrs"
			:label="displayLabel"
			:type="mode !== 'select' && mode !== 'combobox' && mode !== 'checkbox' && mode !== 'checkbox-group' && mode !== 'radio-group' ? type : undefined"
			:variant="variant"
			:flat="flat"
			:single-line="singleLine"
			:density="density"
			:rounded="rounded"
			:color="color"
			:base-color="baseColor"
			:bg-color="bgColor"
			:validate-on="validateOn"
			:hint="hint"
			:persistent-hint="persistentHint"
			:persistent-placeholder="mode !== 'select' && mode !== 'combobox' && mode !== 'checkbox' && mode !== 'checkbox-group' && mode !== 'radio-group' ? persistentPlaceholder : undefined"
			:hide-details="resolvedHideDetails"
			:clearable="clearable"
			:clear-icon="clearIcon"
			:readonly="readonly"
			:disabled="disabled"
			:id="id || undefined"
			:name="name || undefined"
			:autocomplete="mode !== 'select' && mode !== 'combobox' && mode !== 'checkbox' && mode !== 'checkbox-group' && mode !== 'radio-group' ? (autocomplete || undefined) : undefined"
			:placeholder="placeholder"
			:rows="mode === 'textarea' ? rows : undefined"
			:max-rows="mode === 'textarea' ? maxRows : undefined"
			:auto-grow="mode === 'textarea' ? autoGrow : undefined"
			:counter="counter"
			:prepend-icon="prependIcon || undefined"
			:append-icon="appendIcon || undefined"
			:prepend-inner-icon="prependInnerIcon"
			:append-inner-icon="appendInnerIcon"
			:prefix="mode !== 'select' && mode !== 'combobox' && mode !== 'checkbox' && mode !== 'checkbox-group' && mode !== 'radio-group' ? (prefix || undefined) : undefined"
			:suffix="mode !== 'select' && mode !== 'combobox' && mode !== 'checkbox' && mode !== 'checkbox-group' && mode !== 'radio-group' ? (suffix || undefined) : undefined"
			:min="mode !== 'select' && mode !== 'combobox' && mode !== 'checkbox' && mode !== 'checkbox-group' && mode !== 'radio-group' ? min : undefined"
			:max="mode !== 'select' && mode !== 'combobox' && mode !== 'checkbox' && mode !== 'checkbox-group' && mode !== 'radio-group' ? max : undefined"
			:step="mode !== 'select' && mode !== 'combobox' && mode !== 'checkbox' && mode !== 'checkbox-group' && mode !== 'radio-group' ? step : undefined"
			:minlength="mode !== 'select' && mode !== 'combobox' && mode !== 'checkbox' && mode !== 'checkbox-group' && mode !== 'radio-group' ? minLength : undefined"
			:maxlength="mode !== 'select' && mode !== 'combobox' && mode !== 'checkbox' && mode !== 'checkbox-group' && mode !== 'radio-group' ? maxLength : undefined"
			:items="mode === 'select' || mode === 'combobox' ? items : undefined"
			:item-title="mode === 'select' || mode === 'combobox' ? itemTitle : undefined"
			:item-value="mode === 'select' || mode === 'combobox' ? itemValue : undefined"
			:multiple="mode === 'select' || mode === 'combobox' ? multiple : undefined"
			:chips="mode === 'select' || mode === 'combobox' ? chips : undefined"
			:closable-chips="mode === 'select' || mode === 'combobox' ? closableChips : undefined"
			:menu-icon="mode === 'select' || mode === 'combobox' ? menuIcon : undefined"
			:menu-props="mode === 'select' || mode === 'combobox' ? menuProps : undefined"
			:no-data-text="mode === 'select' || mode === 'combobox' ? noDataText : undefined"
			:return-object="mode === 'select' || mode === 'combobox' ? returnObject : undefined"
			:hide-no-data="mode === 'select' || mode === 'combobox' ? hideNoData : undefined"
			:no-filter="mode === 'select' || mode === 'combobox' ? noFilter : undefined"
			:item-props="mode === 'select' || mode === 'combobox' ? itemProps : undefined"
			:filter-keys="mode === 'select' || mode === 'combobox' ? filterKeys : undefined"
			:custom-filter="mode === 'select' || mode === 'combobox' ? customFilter : undefined"
			:open-on-clear="mode === 'select' || mode === 'combobox' ? openOnClear : undefined"
			:messages="messages"
			:error-messages="errorMessages"
			:max-errors="maxErrors"
			:loading="loading"
			:error="error"
			:rules="rules"
			class="input-compo__field"
			@click:clear="onClear"
			@click:append-inner="onClickAppend"
			@focus="onFocus"
			@blur="onBlur"
			@update:focused="onUpdateFocused"
			@keyup.enter="$emit('keyupEnter')">
			<template
				v-if="$slots.item && (mode === 'select' || mode === 'combobox')"
				#item="slotProps">
				<slot name="item" v-bind="slotProps" />
			</template>
			<template
				v-if="$slots.selection && (mode === 'select' || mode === 'combobox')"
				#selection="slotProps">
				<slot name="selection" v-bind="slotProps" />
			</template>
			<template
				v-if="$slots['chip'] && (mode === 'select' || mode === 'combobox')"
				#chip="slotProps">
				<slot name="chip" v-bind="slotProps" />
			</template>
			<template
				v-if="$slots['prepend-item'] && (mode === 'select' || mode === 'combobox')"
				#prepend-item="slotProps">
				<slot name="prepend-item" v-bind="slotProps" />
			</template>
			<template
				v-if="$slots['append-item'] && (mode === 'select' || mode === 'combobox')"
				#append-item="slotProps">
				<slot name="append-item" v-bind="slotProps" />
			</template>
			<template
				v-if="$slots['no-data'] && (mode === 'select' || mode === 'combobox')"
				#no-data="slotProps">
				<slot name="no-data" v-bind="slotProps" />
			</template>
		</component>
		<div v-if="message" class="input-compo__message">{{ message }}</div>
	</div>
</template>

<script src="@/js/components/input/inputCompo.js"/>
<style scoped lang="scss">
	@import "@/css/components/input/input-compo.scss";
</style>
