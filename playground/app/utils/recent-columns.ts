import type { TableColumn } from '@nuxt/ui';
import { h } from 'vue';
import { UBadge } from '#components';
import { formatBytes } from './dummy';
import type { Activation } from './dummy';

const statusColor: Record<Activation['status'], 'success' | 'warning' | 'error'> = {
	active: 'success',
	pending: 'warning',
	failed: 'error',
};

export const recentColumns: TableColumn<Activation>[] = [
	{
		accessorKey: 'id',
		header: 'ID',
		cell: ({ row }) => '#' + row.original.id,
	},
	{
		accessorKey: 'date',
		header: 'Date',
		cell: ({ row }) =>
			new Date(row.original.date).toLocaleString('en-GB', {
				day: 'numeric',
				month: 'short',
				hour: '2-digit',
				minute: '2-digit',
				timeZone: 'UTC',
			}),
	},
	{
		accessorKey: 'status',
		header: 'Status',
		cell: ({ row }) => {
			return h(
				UBadge,
				{ variant: 'subtle', color: statusColor[row.original.status], class: 'capitalize' },
				() => row.original.status,
			);
		},
	},
	{
		accessorKey: 'device',
		header: 'Device',
		cell: ({ row }) => row.original.device,
	},
	{
		accessorKey: 'account',
		header: 'Account',
		cell: ({ row }) => row.original.account,
	},
	{
		accessorKey: 'bytes',
		header: () => h('div', { class: 'text-right' }, 'Bytes'),
		cell: ({ row }) => h('div', { class: 'text-right font-medium' }, formatBytes(row.original.bytes)),
	},
];
