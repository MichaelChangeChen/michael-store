<template>
	<section class="games-mgnt d-flex flex-column ga-6">
		<header class="games-mgnt__hero">
			<div>
				<p class="games-mgnt__eyebrow">Michael Store</p>
				<h1 class="games-mgnt__title">商品管理</h1>
				<p class="games-mgnt__subtitle">
					目前已接上商品清單 API，畫面會直接呈現中文名稱、英文名稱、價格、庫存、類型與封面。
				</p>
			</div>
			<div class="games-mgnt__hero-actions">
				<BtnCompo
					set-type="delete"
					name="批次刪除"
					@click="bulkSetOffline" />
			</div>
		</header>

		<section class="games-mgnt__stats">
			<v-sheet class="games-mgnt__stat-card" rounded="xl" border>
				<span class="games-mgnt__stat-label">商品總數</span>
				<strong class="games-mgnt__stat-value">{{ statusSummary.total }}</strong>
			</v-sheet>
			<v-sheet class="games-mgnt__stat-card" rounded="xl" border>
				<span class="games-mgnt__stat-label">總庫存</span>
				<strong class="games-mgnt__stat-value">{{ statusSummary.stock }}</strong>
			</v-sheet>
			<v-sheet class="games-mgnt__stat-card" rounded="xl" border>
				<span class="games-mgnt__stat-label">低庫存品項</span>
				<strong class="games-mgnt__stat-value">{{ statusSummary.lowStock }}</strong>
			</v-sheet>
		</section>

		<v-card rounded="xl" variant="flat" border>
			<div class="games-mgnt__filters">
				<InputCompo
					v-model="keyword"
					label="搜尋商品"
					placeholder="搜尋名稱、類型或 UUID"
					prepend-inner-icon="mdi-magnify"
					hide-details />
				<InputCompo
					v-model="filters.type"
					mode="select"
					label="類型"
					:items="typeOptions"
					item-title="title"
					item-value="value"
					hide-details />
				<InputCompo
					v-model="filters.stock"
					mode="select"
					label="庫存狀態"
					:items="stockOptions"
					item-title="title"
					item-value="value"
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
					:total-items="totalCount"
					:current-page="page"
					:max-page="maxPage"
					:total-count="totalCount"
					:loading="listLoading"
					:is-show-select="true"
					:fixed-header="false"
					item-key="uuid"
					no-data-text="目前沒有符合條件的商品資料"
					@datatableOptions="onTableOptionsChange">
					<template #cover="{ item }">
						<div class="games-mgnt__cover">
							<img v-if="item.url" :src="item.url" :alt="item.chiName" />
							<div v-else class="games-mgnt__cover-placeholder">
								<v-icon icon="mdi-image-off-outline" />
							</div>
						</div>
					</template>

					<template #price="{ item }">
						NT$ {{ item.price.toLocaleString() }}
					</template>

					<template #quantity="{ item }">
						{{ item.quantity }}
					</template>

					<template #stockStatus="{ item }">
						<v-chip
							:color="getStockMeta(item.quantity).color"
							size="small"
							variant="tonal">
							{{ getStockMeta(item.quantity).label }}
						</v-chip>
					</template>

					<template #btns="{ item }">
						<div class="d-flex align-center justify-center ga-2 flex-wrap">
							<BtnCompo
								name="刪除"
								size="x-small"
								set-icon="mdi-delete-outline"
								color="error"
								variant="text"
								@click="removeGame(item)" />
						</div>
					</template>
				</DatatableComponent>
			</div>
		</v-card>
	</section>
</template>

<script src="@/js/gamesMgnt/gamesMgnt.js"/>

<style scoped lang="scss">
@import '@/assets/scss/eip-variables';

.games-mgnt {
	min-height: 100%;
	position: relative;

	&::before {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		background:
			radial-gradient(circle at 0% 0%, rgba(89, 232, 255, 0.1), transparent 26%),
			radial-gradient(circle at 100% 20%, rgba(255, 79, 191, 0.1), transparent 22%);
	}

	&__hero {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 20px;
		position: relative;
		padding: 32px 34px;
		border: 1px solid rgba(89, 232, 255, 0.24);
		border-radius: 28px;
		color: #fff;
		background:
			radial-gradient(circle at top right, rgba(255, 79, 191, 0.22), transparent 28%),
			radial-gradient(circle at left center, rgba(89, 232, 255, 0.24), transparent 26%),
			linear-gradient(135deg, rgba(20, 30, 64, 0.94) 0%, rgba(28, 40, 98, 0.9) 48%, rgba(62, 22, 86, 0.9) 100%);
		box-shadow:
			inset 0 0 0 1px rgba(255, 255, 255, 0.03),
			0 22px 48px rgba(3, 8, 21, 0.34),
			0 0 34px rgba(120, 104, 255, 0.1);
		overflow: hidden;
	}

	&__hero::after {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: linear-gradient(120deg, transparent 0%, rgba(89, 232, 255, 0.12) 48%, transparent 56%);
		transform: translateX(-120%);
		animation: hero-scan 7s linear infinite;
	}

	&__eyebrow {
		margin-bottom: 8px;
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		opacity: 0.86;
		color: $eip-hot-pink;
	}

	&__title {
		font-size: clamp(2rem, 3vw, 2.75rem);
		line-height: 1.05;
		font-weight: 800;
		text-shadow: 0 0 18px rgba(255, 79, 191, 0.15);
	}

	&__subtitle {
		max-width: 720px;
		margin-top: 12px;
		color: rgba(238, 247, 255, 0.74);
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
		border: 1px solid rgba(89, 232, 255, 0.14);
		background: linear-gradient(180deg, rgba(26, 35, 68, 0.84) 0%, rgba(18, 24, 46, 0.94) 100%);
		box-shadow:
			inset 0 0 0 1px rgba(255, 255, 255, 0.02),
			0 16px 40px rgba(2, 6, 18, 0.26);
	}

	&__stat-label {
		display: block;
		color: $eip-muted;
		font-size: 0.9rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	&__stat-value {
		display: block;
		margin-top: 10px;
		font-size: 2rem;
		font-weight: 800;
		color: $eip-text;
		text-shadow: 0 0 14px rgba(89, 232, 255, 0.08);
	}

	&__filters {
		display: grid;
		grid-template-columns: minmax(0, 2fr) repeat(2, minmax(180px, 1fr)) auto;
		gap: 16px;
		padding: 24px 24px 12px;
		align-items: center;
	}

	&__table {
		padding: 0 16px 16px;
	}

	&__cover {
		width: 52px;
		height: 68px;
		border-radius: 12px;
		overflow: hidden;
		border: 1px solid rgba(89, 232, 255, 0.16);
		background: rgba(15, 22, 45, 0.9);
		box-shadow: 0 0 18px rgba(89, 232, 255, 0.08);

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
			display: block;
		}
	}

	&__cover-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: rgba(89, 232, 255, 0.7);
	}

	:deep(.v-card) {
		border: 1px solid rgba(89, 232, 255, 0.14) !important;
		background: rgba(24, 32, 62, 0.72) !important;
		backdrop-filter: blur(16px);
		box-shadow:
			inset 0 0 0 1px rgba(255, 255, 255, 0.02),
			0 20px 50px rgba(0, 0, 0, 0.32);
	}

	:deep(.v-field) {
		border: 1px solid rgba(89, 232, 255, 0.12);
		background: rgba(26, 35, 68, 0.84) !important;
		box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.02);
	}

	:deep(.v-field__input),
	:deep(.v-label) {
		color: $eip-text !important;
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

@keyframes hero-scan {
	from {
		transform: translateX(-120%);
	}
	to {
		transform: translateX(120%);
	}
}
</style>
