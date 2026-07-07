<template>
	<EditorDialog
		:model-value="visible"
		:isVisiable="visible"
		:title="dialogTitle"
		:max-width="maxWidth"
		:height="height"
		:persistent="true"
		@cancelEditorDialog="closeDialog"
		@cancel="closeDialog"
		@update:modelValue="onVisibleChange"
		@update:model-value="onVisibleChange">
		<div class="d-flex flex-column ga-6">
			<v-card class="content-card pa-4" rounded="lg" variant="flat" border>
				<div class="text-subtitle-1 font-weight-bold mb-3">{{ contentTitle }}</div>
				<div class="d-flex flex-column ga-2">
					<div
						v-for="item in displayContentItems"
						:key="item.label"
						class="text-body-2">
						{{ item.label }}：{{ item.value }}
					</div>
					<div class="text-caption text-medium-emphasis">
						{{ contentHint }}
					</div>
				</div>
			</v-card>

			<v-card class="content-card pa-4" rounded="lg" variant="flat" border>
				<div class="text-subtitle-1 font-weight-bold mb-3">{{ flowTitle }}</div>
				<v-table density="comfortable" class="form-detail__table">
					<thead>
						<tr>
							<th>關卡</th>
							<th>狀態</th>
							<th>時間</th>
							<th>備註</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="record in displayFlowRecords" :key="`${record.stage}-${record.action}-${record.datetime}`">
							<td>{{ record.stage }}</td>
							<td>
								<v-chip
									rounded="pill"
									:color="actionChipColorMap[record.action] || 'grey'"
									size="small"
									variant="tonal"
									label>
									{{ record.action }}
								</v-chip>
							</td>
							<td>{{ record.datetime || '-' }}</td>
							<td>{{ record.note || '-' }}</td>
						</tr>
					</tbody>
				</v-table>
			</v-card>
		</div>

		<template #actions>
			<BtnCompo
				@click="closeDialog"
				color="pink"
				size="small"
				name="關閉" />
		</template>
	</EditorDialog>
</template>

<script src="@/js/components/dialog/checkFormDetailDialog.js"/>
