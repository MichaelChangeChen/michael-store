<template>
	<section class="games-mgnt d-flex flex-column ga-6">
		<header class="games-mgnt__hero">
			<div>
				<p class="games-mgnt__eyebrow">Michael Store</p>
				<h1 class="games-mgnt__title">遊戲管理</h1>
				<p class="games-mgnt__subtitle">
					先用前端資料把管理頁骨架補齊，包含篩選、列表、批次操作與狀態切換。
				</p>
			</div>
			<div class="games-mgnt__hero-actions">
				<BtnCompo
					set-type="add"
					name="新增遊戲" />
				<BtnCompo
					set-type="delete"
					name="批次下架"
					@click="bulkSetOffline" />
			</div>
		</header>

		<section class="games-mgnt__stats">
			<v-sheet class="games-mgnt__stat-card" rounded="xl" border>
				<span class="games-mgnt__stat-label">遊戲總數</span>
				<strong class="games-mgnt__stat-value">{{ statusSummary.total }}</strong>
			</v-sheet>
			<v-sheet class="games-mgnt__stat-card" rounded="xl" border>
				<span class="games-mgnt__stat-label">上架中</span>
				<strong class="games-mgnt__stat-value">{{ statusSummary.online }}</strong>
			</v-sheet>
			<v-sheet class="games-mgnt__stat-card" rounded="xl" border>
				<span class="games-mgnt__stat-label">精選遊戲</span>
				<strong class="games-mgnt__stat-value">{{ statusSummary.featured }}</strong>
			</v-sheet>
		</section>

		<v-card rounded="xl" variant="flat" border>
			<div class="games-mgnt__filters">
				<InputCompo
					v-model="keyword"
					label="搜尋遊戲"
					placeholder="輸入名稱、類型或代碼"
					prepend-inner-icon="mdi-magnify"
					hide-details />
				<InputCompo
					v-model="filters.status"
					mode="select"
					label="狀態"
					:items="gameStatusOptions"
					item-title="title"
					item-value="value"
					hide-details />
				<InputCompo
					v-model="filters.platform"
					mode="select"
					label="平台"
					:items="platformOptions"
					item-title="title"
					item-value="value"
					hide-details />
				<InputCompo
					v-model="filters.featuredOnly"
					mode="checkbox"
					label="只看精選"
					hide-details />
				<BtnCompo
					set-type="close"
					name="清除篩選"
					@click="resetFilters" />
			</div>

			<div class="games-mgnt__table">
				<DatatableComponent
					v-model="selectedRows"
					:headers="headers"
					:items="filteredGames"
					:is-show-select="true"
					item-key="id"
					:no-data-text="'目前沒有符合條件的遊戲資料'">
					<template #status="{ item }">
						<v-chip
							:color="getStatusMeta(item.status).color"
							size="small"
							variant="tonal">
							{{ getStatusMeta(item.status).label }}
						</v-chip>
					</template>

					<template #players="{ item }">
						{{ item.players.toLocaleString() }}
					</template>

					<template #rating="{ item }">
						<div class="d-flex align-center ga-1">
							<v-icon color="amber-darken-2" icon="mdi-star" size="18" />
							<span>{{ item.rating }}</span>
						</div>
					</template>

					<template #btns="{ item }">
						<div class="d-flex align-center justify-center ga-2 flex-wrap">
							<BtnCompo
								:name="item.featured ? '取消精選' : '設為精選'"
								size="x-small"
								variant="outlined"
								@click="toggleFeatured(item)" />
							<BtnCompo
								name="切換狀態"
								size="x-small"
								set-icon="mdi-sync"
								color="secondary"
								variant="text"
								@click="cycleStatus(item)" />
						</div>
					</template>
				</DatatableComponent>
			</div>
		</v-card>
	</section>
</template>

<script src="@/js/gamesMgnt/gamesMgnt.js"/>

<style scoped lang="scss">
.games-mgnt {
	min-height: 100%;

	&__hero {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 20px;
		padding: 28px 32px;
		border-radius: 28px;
		color: #fff;
		background:
			radial-gradient(circle at top right, rgba(255, 255, 255, 0.26), transparent 34%),
			linear-gradient(135deg, #123458 0%, #1f6e8c 45%, #d98e04 100%);
		box-shadow: 0 22px 48px rgba(18, 52, 88, 0.22);
	}

	&__eyebrow {
		margin-bottom: 8px;
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		opacity: 0.78;
	}

	&__title {
		font-size: clamp(2rem, 3vw, 2.75rem);
		line-height: 1.05;
		font-weight: 800;
	}

	&__subtitle {
		max-width: 720px;
		margin-top: 12px;
		color: rgba(255, 255, 255, 0.86);
	}

	&__hero-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
	}

	&__stats {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 16px;
	}

	&__stat-card {
		padding: 20px 22px;
		background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
	}

	&__stat-label {
		display: block;
		color: #5b6575;
		font-size: 0.9rem;
	}

	&__stat-value {
		display: block;
		margin-top: 10px;
		font-size: 2rem;
		font-weight: 800;
		color: #123458;
	}

	&__filters {
		display: grid;
		grid-template-columns: minmax(0, 2fr) repeat(2, minmax(180px, 1fr)) auto auto;
		gap: 16px;
		padding: 24px 24px 12px;
		align-items: center;
	}

	&__table {
		padding: 0 16px 16px;
	}
}

@media (max-width: 960px) {
	.games-mgnt {
		&__hero {
			padding: 24px;
			flex-direction: column;
			align-items: flex-start;
		}

		&__stats {
			grid-template-columns: 1fr;
		}

		&__filters {
			grid-template-columns: 1fr;
		}
	}
}
</style>
