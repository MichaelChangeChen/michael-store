<template>
      <v-overlay z-index="99999" :value="showLoading">
        <v-progress-circular
            :size="170"
            :width="10"
            color="#8fc8db"
            indeterminate>
			<h2 class="white--text">資料載入中...</h2>
		</v-progress-circular>
      </v-overlay>
</template>

<script src="@/js/components/loadingMask.js"></script>
