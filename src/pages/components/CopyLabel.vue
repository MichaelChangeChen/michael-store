<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <div
	  	v-on="on"
		:class="{ 'd-block': isBlock }"
	  	@click.stop.prevent="copy"
	  	ref="copylabel"
	  	class="copylabel animate__faster">
		{{ text }}
	</div>
    </template>
    <span>{{ tooltip }}</span>
  </v-tooltip>
</template>

<script src="@/js/components/copyLabel.js"></script>

<style scoped lang="scss">
@import '@/css/components/copy-label.scss';
</style>
