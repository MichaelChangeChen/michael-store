<template>
	<div
		@mousedown="handleOutsideClick"
		:class="{ 'search-mask-open': isVisiable }"
		class="search-mask">
		<div :class="{ 'search-bar-hide': !isVisiable }" class="search-bar">
			<div class="fixed-title pa-3 pb-2">
				<h3 class="d-flex align-center ga-1 text-grey-darken-1">
					<v-icon color="primary" size="small">mdi-magnify</v-icon>
					查詢條件
				</h3>
				<v-divider color="#eeeeee"></v-divider>
			</div>

			<div class="search-content">
				<v-container class="pt-4 pb-1">
					<v-row>
						<slot />
					</v-row>
				</v-container>
			</div>

			<div class="d-flex justify-center ga-5 align-center fixed-button">
				<BtnCompo
					@click="$emit('submitSearchBar')"
					name="搜尋"
					size="small"
					variant="elevated"
					setType="search"
					setIcon=" " />
				<BtnCompo
					@click="$emit('resetSearchBar')"
					name="重設"
					size="small" />
				<BtnCompo
					@click="$emit('closeSearchBar')"
					name="關閉"
					size="small"
					setIcon=" "
					variant="elevated"
					setType="cancel" />
			</div>
		</div>
	</div>
</template>

<script src="@/js/components/search/searchBar.js"></script>

<style lang="scss" scoped>
	@import '@/css/components/search/search-bar.scss';
</style>
