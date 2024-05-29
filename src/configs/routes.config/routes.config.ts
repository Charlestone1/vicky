import { lazy } from 'react'
import authRoute from './authRoute'
import type { Routes } from '@/@types/routes'
import { ADMIN, GENERALMANAGER, MANAGER } from '@/constants/roles.constant'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes = [
    {
        key: 'home',
        path: '/home',
        component: lazy(() => import('@/views/Home')),
        role: [],
        authority: [],
    },
    // {
    //     key: 'warranty',
    //     path: '/warranty',
    //     component: lazy(() => import('@/views/warranty/ManageWarranty')),
    //     role: [],
    //     authority: [],
    // },
    // {
    //     key: 'warranty',
    //     path: '/warranty/new-warranty',
    //     component: lazy(() => import('@/views/warranty/warranty-form/Warranty')),
    //     role: [],
    //     authority: [],
    // },
    {
        key: 'staff',
        path: '/staff/:tab',
        component: lazy(() => import('@/views/staff/AllStaffTable')),
        role: [],
        authority: [ADMIN, MANAGER, GENERALMANAGER],
        meta: {
            header: 'Staff',
            headerContainer: true,
        },
    },
    {
        key: 'staff.info',
        path: `/staff/:staffId/staff-info`,
        component: lazy(() => import('@/views/staff/staff-details')),
        role: [],
        authority: [ADMIN, MANAGER, GENERALMANAGER],
        meta: {
            header: 'Staff Info',
        },
    },
    {
        key: 'managers',
        path: '/managers',
        component: lazy(() => import('@/views/manager')),
        role: [],
        authority: [],
    },
    // {
    //     key: 'genmanagers',
    //     path: '/general-managers',
    //     component: lazy(() => import('@/views/general-manager')),
    //     role: [],
    //     authority: [],
    // },
    // {
    //     key: 'departments',
    //     path: '/departments',
    //     component: lazy(() => import('@/views/department/ManageDepartments')),
    //     role: [],
    //     authority: [],
    // },
    {
        key: 'account.settings',
        path: `/account/settings/:tab`,
        component: lazy(() => import('@/views/account/Settings')),
        role: [],
        authority: [ADMIN, MANAGER],
        meta: {
            header: 'Settings',
            headerContainer: true,
        },
    },
    {
        key: 'account.activityLog',
        path: `/account/activity-log`,
        component: lazy(() => import('@/views/account/ActivityLog')),
        role: [],
        authority: [ADMIN, MANAGER, GENERALMANAGER],
    },
    // {
    //     key: 'services',
    //     path: `/services/:tab`,
    //     component: lazy(() => import('@/views/companyservices')),
    //     role: [],
    //     authority: [ADMIN, MANAGER, GENERALMANAGER],
    // },
    // {
    //     key: 'customers.customerList',
    //     path: `/customers`,
    //     component: lazy(() => import('@/views/customer')),
    //     role: [],
    //     authority: [ADMIN, MANAGER, GENERALMANAGER],
    //     meta: {
    //         header: 'Customers',
    //     },
    // },
    // {
    //     key: 'customers.details',
    //     path: `/customers/:customerId`,
    //     component: lazy(() => import('@/views/customer/CustomerDatail')),
    //     role: [],
    //     authority: [ADMIN, MANAGER, GENERALMANAGER],
    //     meta: {
    //         header: 'Customer Info',
    //     },
    // },
    // {
    //     key: 'customers.statement',
    //     path: `/customers/:customerId/open-invoice`,
    //     component: lazy(() => import('@/views/customer/customer-open-invoice')),
    //     role: [],
    //     authority: [ADMIN, MANAGER, GENERALMANAGER],
    //     meta: {
    //         header: 'Open Invoice',
    //     },
    // },
    // {
    //     key: 'customers.invoicedetails',
    //     path: `/customers/:customerId/open-invoice/invoice-details`,
    //     component: lazy(() => import('@/views/customer/customer-open-invoice/ManageOpenInvoiceDetails')),
    //     role: [],
    //     authority: [ADMIN, MANAGER, GENERALMANAGER],
    //     meta: {
    //         header: 'Open Invoice',
    //     },
    // },
    // {
    //     key: 'invoice',
    //     path: `/invoice`,
    //     component: lazy(() => import('@/views/invoice')),
    //     role: [],
    //     authority: [ADMIN, MANAGER, GENERALMANAGER],
    //     meta: {
    //         header: 'Invoice',
    //     },
    // },
    // {
    //     key: 'invoice.sent',
    //     path: `/sent-out-invoice`,
    //     component: lazy(() => import('@/views/invoice/sent-out-invoice')),
    //     role: [],
    //     authority: [ADMIN, MANAGER, GENERALMANAGER],
    //     meta: {
    //         header: 'Invoice Sent Out',
    //     },
    // },
    // {
    //     key: 'invoice.details',
    //     path: `/invoice/:invoiceIdParams`,
    //     component: lazy(() => import('@/views/invoice/invoice-details')),
    //     role: [],
    //     authority: [ADMIN, MANAGER, GENERALMANAGER],
    //     meta: {
    //         header: 'Invoice Details',
    //     },
    // },
    // {
    //     key: 'invoice.sentdetails',
    //     path: `/sent-out-invoice/invoice/:invoiceIdParams`,
    //     component: lazy(() => import('@/views/invoice/sent-out-invoice/ManageSentInvoiceDetails')),
    //     role: [],
    //     authority: [ADMIN, MANAGER, GENERALMANAGER],
    //     meta: {
    //         header: 'Invoice Details',
    //     },
    // },
    // {
    //     key: 'vehicles.details',
    //     path: '/vehicles/:tab',
    //     component: lazy(() => import('@/views/vehicles-inshop/')),
    //     role: [],
    //     authority: [],
    // },
    // {
    //     key: 'jobsqueue',
    //     path: `/jobs/:tab`,
    //     component: lazy(() => import('@/views/jobs-queue')),
    //     role: [],
    //     authority: [ADMIN, MANAGER, GENERALMANAGER],
    //     meta: {
    //         header: 'Jobs & Queue',
    //     },
    // },
    // {
    //     key: 'entry.details',
    //     path: `/jobs/entries/:entryIdParams`,
    //     component: lazy(() => import('@/views/entries/ManageEntryDetails')),
    //     role: [],
    //     authority: [ADMIN, MANAGER, GENERALMANAGER],
    //     meta: {
    //         header: 'Entry Details',
    //     },
    // },
    // {
    //     key: 'inventory',
    //     path: '/inventory',
    //     component: lazy(() => import('@/views/inventory')),
    //     role: [],
    //     authority: [],
    // },
    // {
    //     key: 'inventory.details',
    //     path: `/inventory/:inventoryIdParams`,
    //     component: lazy(() => import('@/views/entries/ManageEntryDetails')),
    //     role: [],
    //     authority: [ADMIN, MANAGER, GENERALMANAGER],
    //     meta: {
    //         header: 'Inventory Details',
    //     },
    // },
    // {
    //     key: 'messaging',
    //     path: '/messaging',
    //     component: lazy(() => import('@/views/messaging')),
    //     role: [],
    //     authority: [],
    // },

]
