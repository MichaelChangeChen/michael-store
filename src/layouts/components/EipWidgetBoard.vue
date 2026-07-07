<template>
	<draggable
		v-model="model"
		:animation="200"
		item-key="id"
		class="eip-grid ga-4"
		handle=".card-drag"
		ghost-class="eip-ghost">
		<template #item="{ element }">
			<v-card
				:class="[
					'eip-card pa-5 position-relative',
					`eip-card--${element.id}`,
					element.colSpan === 2 ? 'eip-card--span-2' : ''
				]"
				rounded="xl"
				elevation="1">
				<div class="card-drag d-flex justify-end position-absolute top-0 left-0 right-0 cursor-grab opacity-0">
					<v-icon color="grey-lighten-1" class="mr-3">mdi-drag</v-icon>
				</div>

				<div v-if="element.id === 'todo'" class="d-flex flex-column ga-3 pt-1">
					<div class="card-header d-flex align-center justify-space-between">
						<h3>待辦與通知</h3>
						<v-icon>mdi-clock-outline</v-icon>
					</div>
					<div class="todo-box d-flex flex-wrap ga-4">
						<v-hover v-for="list in todoBoxList" :key="list.id">
							<template #default="{ isHovering, props }">
								<v-card
									v-bind="props"
									:elevation="isHovering ? 3 : 0"
									class="stat d-flex flex-column align-center ga-2 cursor-pointer"
									variant="plain">
									<div class="flex-grow-1">{{ list.name }}</div>
									<div :class="`value ${list.isRed ? 'value--danger' : ''}`">{{ list.count }}</div>
								</v-card>
							</template>
						</v-hover>
					</div>
				</div>

				<div v-else-if="element.id === 'shortcuts'" class="d-flex flex-column ga-3 h-100 pt-1">
					<div class="card-header d-flex align-center justify-space-between">
						<h3>常用快速連結</h3>
						<v-icon>mdi-layers-outline</v-icon>
					</div>
					<div class="shortcut-box ga-3 flex-grow-1">
						<v-hover v-for="list in shortcutList" :key="list.id">
							<template #default="{ isHovering, props }">
								<v-card
									v-bind="props"
									:elevation="isHovering ? 3 : 0"
									class="d-flex flex-column justify-center align-center ga-2 pa-4 text-center text-body-2 text-medium-emphasis cursor-pointer"
									variant="plain">
									<v-icon size="x-large">{{ list.icon }}</v-icon>
									<span>{{ list.name }}</span>
								</v-card>
							</template>
						</v-hover>
					</div>
				</div>

				<div v-else-if="element.id === 'announcements'" class="d-flex flex-column ga-3 h-100 pt-1">
					<div class="card-header d-flex align-center justify-space-between">
						<h3>最新公告</h3>
						<BtnCompo
							v-on:click="pageGoTo('/latest-announcements')"
							name="查看更多"
							color="teal"
							variant="tonal"
							size="small" />
					</div>
					<div class="d-flex flex-column ga-4">
						<article class="list-item d-flex flex-column ga-1 border rounded-lg pa-3 bg-white">
							<div class="list-status d-flex align-center justify-space-between">
								<v-chip rounded="pill" size="x-small" text="緊急" variant="flat" color="red" />
								<span class="text-body-2 text-medium-emphasis">2 小時前</span>
							</div>
							<h4>新版 SSO 登入機制上線通知</h4>
							<p class="text-body-2 text-medium-emphasis">請同仁於指定時間後使用新版登入流程，如遇異常請洽資訊單位協助處理。</p>
						</article>
						<article class="list-item d-flex flex-column ga-1 border rounded-lg pa-3 bg-white">
							<div class="list-status d-flex align-center justify-space-between">
								<v-chip rounded="pill" size="x-small" text="一般" variant="flat" color="blue" />
								<span class="text-body-2 text-medium-emphasis">今天</span>
							</div>
							<h4>年度設備盤點作業開始</h4>
							<p class="text-body-2 text-medium-emphasis">請各單位依公告時程完成設備清點與系統回報，以利後續統計作業。</p>
						</article>
						<article class="list-item d-flex flex-column ga-1 border rounded-lg pa-3 bg-white">
							<div class="list-status d-flex align-center justify-space-between">
								<v-chip rounded="pill" size="x-small" text="提醒" variant="flat" color="orange" />
								<span class="text-body-2 text-medium-emphasis">10 月 8 日</span>
							</div>
							<h4>資訊安全教育訓練通知</h4>
							<p class="text-body-2 text-medium-emphasis">請於指定期間完成線上課程與測驗，以符合年度資安稽核要求。</p>
						</article>
					</div>
				</div>

				<div v-else-if="element.id === 'congress'" class="d-flex flex-column ga-3 h-100 pt-1">
					<div class="card-header d-flex align-center justify-space-between">
						<h3>國會案件概況</h3>
						<v-icon>mdi-file-document-outline</v-icon>
					</div>
					<div class="congress-box flex-grow-1 px-2 d-flex align-center ga-2">
						<div class="d-flex flex-column ga-3 flex-grow-1">
							<div class="d-flex align-center ga-3 text-body-2">
								<span class="dot teal" />
								<span>已辦結</span>
								<strong>7</strong>
							</div>
							<div class="d-flex align-center ga-3 text-body-2">
								<span class="dot yellow" />
								<span>辦理中</span>
								<strong>3</strong>
							</div>
							<div class="d-flex align-center ga-3 text-body-2">
								<span class="dot brown" />
								<span>待回覆</span>
								<strong>2</strong>
							</div>
						</div>
						<div class="chart-box flex-grow-1 position-relative w-50 h-100">
							<ApexCharts
								:options="congressChartOptions"
								:series="congressChartSeries"
								height="180"
								type="donut"
								width="100%" />
							<div class="center-message position-absolute d-flex flex-column align-center justify-center">
								<span>16</span>
								<small>總案件</small>
							</div>
						</div>
					</div>
				</div>

				<div v-else-if="element.id === 'schedule'" class="d-flex flex-column ga-3 h-100 pt-1">
					<div class="card-header d-flex align-center justify-space-between">
						<h3>今日行程</h3>
						<RouterLink to="/room-search">
							<BtnCompo color="teal" name="預約會議室" />
						</RouterLink>
					</div>
					<div class="schedule-box d-flex flex-column ga-4 pl-5">
						<v-card class="schedule-card position-relative" variant="flat">
							<span class="dot position-absolute top-0 rounded-circle bg-grey-lighten-2" />
							<span class="time position-absolute bg-white">10:00</span>
							<div class="card pa-4 active d-flex flex-column ga-2">
								<h5>每週例行會議</h5>
								<div class="message d-inline-flex align-center ga-2">
									<v-icon>mdi-map-marker</v-icon>
									302 會議室
								</div>
								<div class="message d-inline-flex align-center ga-2">
									<v-icon>mdi-account</v-icon>
									8 人參與
								</div>
								<BtnCompo color="orange-darken-4" variant="tonal" size="small">+ 加入行事曆</BtnCompo>
							</div>
						</v-card>
						<v-card class="schedule-card position-relative" variant="flat">
							<span class="dot position-absolute top-0 rounded-circle bg-grey-lighten-2" />
							<span class="time position-absolute bg-white">13:30</span>
							<div class="card pa-4 d-flex flex-column ga-2">
								<h5>設備盤點檢討會</h5>
								<div class="message d-inline-flex align-center ga-2">
									<v-icon>mdi-map-marker</v-icon>
									101 會議室
								</div>
							</div>
						</v-card>
						<v-card class="schedule-card position-relative" variant="flat">
							<span class="dot position-absolute top-0 rounded-circle bg-grey-lighten-2" />
							<span class="time position-absolute bg-white">15:00</span>
							<div class="card pa-4 d-flex flex-column ga-2">
								<h5>線上工作討論</h5>
								<div class="message d-inline-flex align-center ga-2">
									<v-icon>mdi-video</v-icon>
									視訊會議
								</div>
							</div>
						</v-card>
					</div>
				</div>

				<div v-else-if="element.id === 'stats'" class="h-100 d-flex flex-column pt-1">
					<div class="d-flex justify-space-evenly ga-2 h-100 flex-wrap pt-4">
						<v-hover v-for="list in statList" :key="list.id">
							<template #default="{ isHovering, props }">
								<v-card
									v-bind="props"
									:elevation="isHovering ? 3 : 0"
									v-on:click="pageGoTo(list.url)"
									class="stat item-border cursor-pointer d-flex flex-column ga-2 align-center justify-center flex-grow-1"
									variant="plain">
									<v-icon size="large">{{ list.icon }}</v-icon>
									<div>{{ list.name }}</div>
								</v-card>
							</template>
						</v-hover>
					</div>
				</div>
			</v-card>
		</template>
	</draggable>
</template>

<script src="@/js/eip/components/eipWidgetBoard.js" />

<style lang="scss" scoped>
@import '@/css/eip/components/eip-widget-board.scss';
</style>
