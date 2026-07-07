<template>
	<div class="ck-editor">
		<CKEditor
			v-model="setValue"
			:editor="editor"
			:config="editorConfig"
			:disabled="disabled"
			@input="handleInput"
			@ready="handleReady"
			@focus="handleFocus"
			@blur="handleBlur"
			@destroy="handleDestroy" />
	</div>
</template>

<script src="@/js/components/cKEditor/cKEditor.js"/>