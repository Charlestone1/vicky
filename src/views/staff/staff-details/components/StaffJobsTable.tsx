import React, { useEffect, useMemo, useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/store/hook'
import Table from '@/components/ui/Table'
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFacetedMinMaxValues,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
} from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils'
import type {
    ColumnDef,
    FilterFn,
    // ColumnFiltersState,
    Row,
    // Column,
} from '@tanstack/react-table'
// import type { InputHTMLAttributes } from 'react'
import { Button, Card, Pagination, Select, Spinner } from '@/components/ui'
import { PaginationSelectOption } from '@/views/@types/shared'
import { useParams } from 'react-router-dom'
import { formatDateToMMMDDYYYY } from '@/utils/DateFormater'
import { fetchJobHistoryfiltered, fetchStaffJobsData } from '@/store/slices/staff-jobs/jobHistorySlice'

import { Field, Form, Formik } from 'formik'
import type { FieldProps } from 'formik'
import * as Yup from 'yup'
import { FormContainer, FormItem } from '@/components/ui/Form'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
// import { useParams } from 'react-router-dom'
import type { CommonProps } from '@/@types/common'
import { HiOutlineFilter } from 'react-icons/hi'
import { TbFilterOff } from 'react-icons/tb'

import {
    Document,
    Page,
    View,
    Text,
    StyleSheet,
    Image,
    pdf,
} from '@react-pdf/renderer'
import logo1 from '../../../../../public/img/logo/logo-light-full.png'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
// import moment from 'moment'
import { FiUpload } from 'react-icons/fi'

interface JobHistoryProps extends CommonProps {
    disableSubmit?: boolean
}

interface GeoLocation {
    locationType: string;
    description: string;
    coordinates: {
        latitude: number;
        longitude: number;
    };
    _id: string;
}

interface ServiceDetail {
    serviceId: string;
    _id: string;
    serviceName: string;
    serviceType: string;
}

interface CarDetail {
    vin: string;
    year: number;
    make: string;
    entryDate: string;
    model: string;
    colour: string;
    warrantyServiceIds: string[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    warrantyHistory: any[];
    serviceIds: string[];
    servicesDone: {
        serviceId: string;
        staffId: string;
        _id: string;
        staffName: string;
        serviceName: string;
    }[];
    serviceDetails: ServiceDetail[];
    geoLocations: GeoLocation[];
    price: number;
    category: string;
    staffId: string;
    porterId: string | null;
    priceBreakdown: {
        serviceName: string;
        serviceType: string;
        price: number;
        serviceId: string;
        dealership: boolean;
        qbId: string;
        lineId: string;
        staffId: string;
        _id: string;
        stafName: string;
        stafEmail: string;
    }[];
    _id: string;
    serviceNames: string[];
    hasWorkStarted: boolean;
    areAllServicesDone: boolean;
    perCentageOfServicesDone: number;
    servicesDoneFraction: string;
    staffName: string;
    latestWorkDate: string;
}
interface NewDataObject {
    _id: string;
    customerId: string;
    customerName: string;
    customerEmail: string;
    entryDate: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isFromAppointment: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isFromDealership: any;
    isActive: boolean;
    numberOfCarsAdded: number;
    numberOfVehicles: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isDeleted: any;
    carsDone: number;
    id: string;
    carDetail: CarDetail;
}


type YearFormSchema = {
    staffId: string | undefined
    customerId: string
    serviceId: string
}

const { Tr, Th, Td, THead, TBody, Sorter } = Table

const validationSchema = Yup.object().shape({
    staffId: Yup.string(),
    customerId: Yup.string(),
    serviceId: Yup.string()
});

type CustomerData = {
    customerId: string;
    customerName: string
}
type ServiceData = {
    serviceId: string;
    _id: string;
    staffName: string;
    serviceName: string;
    staffId: string;
}
// type NewServiceData = {
//     serviceId: string;
//     serviceName: string;
// }


interface Option {
    value: string
    label: string
}




const fuzzyFilter: FilterFn<NewDataObject> = (row, columnId, value, addMeta) => {
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value)
    // console.log(value)

    // Store the itemRank info
    addMeta({
        itemRank,
    })

    // Return if the item should be filtered in/out
    return itemRank.passed
}

const StaffJobsTable = (props: JobHistoryProps) => {
    const [globalFilter, setGlobalFilter] = useState('')
    const dispatch = useAppDispatch()
    const { data, error, loading } = useAppSelector((state) => state.jobhistoryrep)
    const { staffId } = useParams()
    const [jobsData, setJobsData] = useState<NewDataObject[]>([])
    const [customerDetails, setCustomerDetails] = useState<CustomerData[]>([]);
    const [serviceDetails, setServiceDetails] = useState<ServiceData[]>([]);
    // const [newServiceDetails, setNewServiceDetails] = useState<NewServiceData[]>([]);
    const { user } = useSelector((state: RootState) => state.auth)


    const { disableSubmit = false } = props
    const [submitting, setSubmitting] = useState(false)
    // const { staffId } = useParams()
    // const dispatch = useAppDispatch()

    useEffect(() => {
        if (staffId) {
            dispatch(fetchStaffJobsData(staffId))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [staffId])
    useEffect(() => {
        try {

            if (data) {
                const newDataArray: NewDataObject[] = [];
                // Loop through each data item in the response
                data.forEach((dataItem) => {
                    // Loop through each car detail in the data item
                    dataItem.invoice.carDetails.forEach((carDetail) => {
                        // Create a new object containing carDetail and its corresponding parent data (excluding invoice)
                        const newDataObject = {
                            ...dataItem,
                            invoice: undefined, // Exclude the invoice data
                            carDetail: carDetail // Include the carDetail data
                        };
                        // Push the new object to the newDataArray
                        newDataArray.push(newDataObject);
                    });
                });

                setJobsData(newDataArray)
            }

        } catch (error) {
            console.log(error as TypeError);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])


    useEffect(() => {
        if (jobsData) {
            const extractedData = jobsData.map((customerData: CustomerData) => ({
                customerId: customerData.customerId,
                customerName: customerData.customerName,
            }));
            setCustomerDetails(extractedData);
        }
    }, [jobsData]);

    // useEffect to populate serviceDetails
    useEffect(() => {
        if (jobsData) {
            const extractedServiceData = jobsData.map((customerData) => customerData.carDetail.servicesDone).flat();
            setServiceDetails(extractedServiceData);
        }
    }, [jobsData]);

    // useEffect(() => {
    //     if (serviceDetails) {
    //         const transformedServiceData = serviceDetails.map((service: ServiceData) => ({
    //             serviceId: service.serviceId,
    //             serviceName: service.serviceName,
    //         }));
    //         setNewServiceDetails(transformedServiceData);
    //     }
    // }, [serviceDetails]);


    const customerOptions: Option[] = Array.from(new Set(customerDetails?.map((customer: CustomerData) => customer.customerId)))
        .map((customerId) => {
            const customer = customerDetails?.find((customer: CustomerData) => customer.customerId === customerId);
            return {
                value: `${customerId}`,
                label: `${customer?.customerName}`
            };
        });

    const serviceOptions: Option[] = Array.from(new Set(serviceDetails?.map((service: ServiceData) => service.serviceId)))
        .map((serviceId) => {
            const serviceName = serviceDetails?.find((service: ServiceData) => service.serviceId.includes(serviceId))?.serviceName;
            return {
                value: `${serviceId}`,
                label: `${serviceName}`
            };
        });




    const filterJobHistoryReport = async (
        values: YearFormSchema
    ) => {
        const {
            staffId,
            customerId,
            serviceId,
        } = values
        setSubmitting(true)

        try {
            await dispatch(fetchJobHistoryfiltered({ staffId, customerId, serviceId }))
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.log(error);

            toast.push(
                <Notification title={`Failed to Fetch Report`} type="danger">
                    {error.message}
                </Notification>
            );
        }
        setSubmitting(false)
    }
    //   For Pagination
    const totalData = jobsData?.length

    const pageSizeOption = [
        { value: 10, label: '10 / page' },
        { value: 20, label: '20 / page' },
        { value: 30, label: '30 / page' },
        { value: 40, label: '40 / page' },
        { value: 50, label: '50 / page' },
    ]

    const columns = useMemo<ColumnDef<NewDataObject>[]>(
        () => [
            {
                header: "Customer",
                accessorKey: "customerName",
            },
            { header: 'Vin', accessorKey: 'carDetail.vin' },
            {
                header: 'Year Make Model', accessorKey: "carDetails.model",
                enableColumnFilter: false,
                cell: ({ row }: { row: Row<NewDataObject> }) => {
                    const item = row.original.carDetail
                    return (
                        <span>
                            {`${item.year} ${item.make} ${item.model}`}
                        </span>
                    )
                },
            },
            {
                header: "Services",
                accessorKey: "carDetails.serviceNames",
                cell: ({ row }: { row: Row<NewDataObject> }) => (
                    <span>
                        {row.original.carDetail.serviceNames.join(", ")}
                    </span>
                ),
            },

            {
                header: 'Date / Time',
                accessorKey: 'carDetail.entryDate',
                // Set the cell renderer for the "Progress" column
                cell: ({ row }: { row: Row<NewDataObject> }) => {
                    return (
                        <span>
                            <span>{formatDateToMMMDDYYYY(row.original.carDetail.entryDate).split('T')[0]} </span>
                        </span>
                    )
                },
            },

        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    const table = useReactTable({
        data: jobsData,
        columns,
        filterFns: {
            fuzzy: fuzzyFilter,
        },
        state: {
            columnFilters: [],
            globalFilter,
        },
        // onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: fuzzyFilter,
        // globalFilterFn: exactFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        debugHeaders: true,
        debugColumns: false,
    })

    // For Pagination
    const onPaginationChange = (page: number) => {
        table.setPageIndex(page - 1)
    }

    const onSelectChange = (value = 0) => {
        table.setPageSize(Number(value))
    }


    if (loading) {
        return (
            <Card className="flex flex-col ">
                <div className="flex justify-between gap-x-2 mt-4 mb-10">
                    {jobsData.length > 0 &&
                        <div>
                            <Formik
                                initialValues={{
                                    staffId: staffId,
                                    customerId: "",
                                    serviceId: "",
                                }}
                                validationSchema={validationSchema}
                                onSubmit={(values, { setSubmitting }) => {
                                    if (!disableSubmit) {
                                        filterJobHistoryReport(values)
                                    } else {
                                        setSubmitting(false)
                                    }
                                }}
                            >
                                {({ values, touched, errors }) => (
                                    <Form>
                                        <FormContainer className="flex flex-col md:flex-row gap-x-1 items-center">
                                            <div className='flex flex-col xs:flex-row gap-x-2'>
                                                <FormItem
                                                    label="Filter by Customer"
                                                    invalid={errors.customerId && touched.customerId}
                                                    errorMessage={errors.customerId}
                                                >
                                                    <Field name="customerId">
                                                        {({
                                                            field,
                                                            form,
                                                        }: FieldProps<YearFormSchema>) => (
                                                            <Select
                                                                field={field}
                                                                form={form}
                                                                size='sm'
                                                                className='xs:w-56 w-full'
                                                                options={customerOptions}
                                                                value={customerOptions.filter(
                                                                    (option) =>
                                                                        option.value ===
                                                                        values.customerId
                                                                )}
                                                                onChange={(option) =>
                                                                    form.setFieldValue(
                                                                        field.name,
                                                                        option?.value
                                                                    )
                                                                }
                                                            />
                                                        )}
                                                    </Field>
                                                </FormItem>
                                                <FormItem
                                                    label="Filter by Services"
                                                    invalid={errors.serviceId && touched.serviceId}
                                                    errorMessage={errors.serviceId}
                                                >
                                                    <Field name="serviceId">
                                                        {({
                                                            field,
                                                            form,
                                                        }: FieldProps<YearFormSchema>) => (
                                                            <Select
                                                                field={field}
                                                                form={form}
                                                                size='sm'
                                                                className='w-56'
                                                                options={serviceOptions}
                                                                value={serviceOptions.filter(
                                                                    (option) =>
                                                                        option.value ===
                                                                        values.serviceId
                                                                )}
                                                                onChange={(option) =>
                                                                    form.setFieldValue(
                                                                        field.name,
                                                                        option?.value
                                                                    )
                                                                }
                                                            />
                                                        )}
                                                    </Field>
                                                </FormItem>
                                            </div>

                                            <div className="flex justify-start items-center gap-x-2">
                                                <Button
                                                    icon={<HiOutlineFilter />}
                                                    loading={submitting}
                                                    variant="solid"
                                                    type="submit"
                                                    size='sm'
                                                >
                                                    {submitting
                                                        ? 'Filtering...'
                                                        : 'Filter'}
                                                </Button>
                                                <Button
                                                    icon={<TbFilterOff />}
                                                    disabled={submitting}
                                                    variant="solid"
                                                    type="submit"
                                                    size='sm'
                                                    onClick={() => dispatch(fetchStaffJobsData(staffId))}
                                                >
                                                    Clear
                                                </Button>
                                            </div>
                                        </FormContainer>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    }
                </div>
                <div className='w-full flex justify-center items-center'>
                    <Spinner size="40px" />
                </div>
            </Card>
        )
    }

    if (error) {
        return (
            <Card className="flex justify-center flex-col items-center min-h-[25rem]">
                <p className="text-center">Error Loading Entry Page</p>
                <div className="text-center">
                    <Button
                        variant="solid"
                        className="mt-4"
                        onClick={() => dispatch(fetchStaffJobsData(staffId))}
                    >
                        Refresh Page
                    </Button>
                </div>
            </Card>
        )
    }
    if (jobsData.length === 0) {
        return (
            <div className="flex items-center justify-center flex-col border border-gray-300 rounded-lg p-3">
                <p>Job service done.</p>
            </div>
        )
    }

    const ThePdfComponent = () => {
        const styles = StyleSheet.create({
            page: {
                paddingTop: 25,
                paddingLeft: 25,
                paddingRight: 25,
                paddingBottom: 53,
            },
            header: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 10,
            },
            headerTextBelow: {
                color: 'gray',
                fontSize: 10,
                fontWeight: 'bold',
                marginTop: 5,
            },
            headerTextBelow2: {
                color: 'gray',
                fontSize: 10,
                fontWeight: 'bold',
                marginTop: 15,
            },
            headerText: {
                color: 'gray',
                fontSize: 20,
                fontWeight: 'bold',
            },
            text: {
                margin: 10,
            },
            image: {
                width: 100,
                height: 40,
                marginLeft: 'auto',
            },

            table: {
                marginTop: 10,
                border: '1 solid gray',
                borderBottom: 'none',
                fontSize: 10,
                marginBottom: 20,
                color: 'gray',
            },
            tableHeadRow: {
                backgroundColor: '#e0e0e0',
                flexDirection: 'row',
                borderBottom: '1 solid gray',
            },
            tableHeadCellCust: {
                fontWeight: 'bold',
                padding: 5,
                width: '27%',
                borderRight: '1 solid gray',
            },
            tableHeadCellMake: {
                fontWeight: 'bold',
                padding: 5,
                width: '18%',
                borderRight: '1 solid gray',
            },
            tableHeadCellSn: {
                fontWeight: 'bold',
                padding: 5,
                width: '5%',
                borderRight: '1 solid gray',
            },
            tableHeadCellTime: {
                fontWeight: 'bold',
                padding: 5,
                width: '17%',
                borderRight: '1 solid gray',
            },
            tableHeadCellService: {
                fontWeight: 'bold',
                padding: 5,
                width: '33%',
                borderRight: '1 solid gray',
            },
            tableBodyRow: {
                flexDirection: 'row',
                borderBottom: '1 solid gray',
            },
            tableBodyCellCust: {
                padding: 5,
                width: '27%',
                borderRight: '1 solid gray',
            },
            tableBodyCellMake: {
                padding: 5,
                width: '18%',
                borderRight: '1 solid gray',
            },
            tableBodyCellsn: {
                padding: 5,
                width: '5%',
                borderRight: '1 solid gray',
            },
            tableBodyCellTime: {
                padding: 5,
                width: '17%',
                borderRight: '1 solid gray',
            },
            tableBodyCellService: {
                padding: 5,
                width: '33%',
                borderRight: '1 solid gray',
            },
            row: {
                flexDirection: 'row',
                borderBottom: '1 solid gray', // Adding border to the table rows
            },
            cell: {
                padding: 5,
                borderRight: '1 solid gray', // Adding border to the table cells
            },
            pageNumber: {
                position: 'absolute',
                fontSize: 12,
                bottom: 30,
                left: 0,
                right: 0,
                textAlign: 'center',
                color: 'grey',
            },
        })

        const currentDate = () => {
            const detail: Intl.DateTimeFormatOptions = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }
            const today = new Date().toLocaleDateString('en-US', detail)
            return today
        }


        return (
            <Document pageLayout="singlePage">
                <Page style={styles.page} size="A4">
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.headerText}>
                                Staff Job History
                            </Text>
                            <Text style={styles.headerTextBelow}>
                                Exported by: {user.firstName} {user.lastName}
                            </Text>
                            <Text style={styles.headerTextBelow}>
                                Date: {currentDate()}
                            </Text>
                        </View>
                        <Image
                            style={styles.image}
                            src={logo1}
                        />
                    </View>
                    {/* Table */}{' '}

                    <View style={styles.table}>
                        {/* Table head */}
                        <View fixed style={styles.tableHeadRow} >
                            <View style={styles.tableHeadCellSn}>
                                <Text>S/N</Text>
                            </View>
                            <View style={styles.tableHeadCellCust}>
                                <Text>Customer</Text>
                            </View>
                            <View style={styles.tableHeadCellMake}>
                                <Text>Year Make Model</Text>
                            </View>
                            <View style={styles.tableHeadCellService}>
                                <Text>Services</Text>
                            </View>
                            <View style={styles.tableHeadCellTime}>
                                <Text>Entry Date</Text>
                            </View>
                        </View>{' '}
                        {/* Table body */}
                        {jobsData.map((item, index) => (
                            <View
                                key={index}
                                style={styles.tableBodyRow}
                            >
                                <View style={styles.tableBodyCellsn}>
                                    <Text>{index + 1}</Text>
                                </View>
                                <View style={styles.tableBodyCellCust}>
                                    <Text>{item.customerName}</Text>
                                </View>
                                <View style={styles.tableBodyCellMake}>
                                    <Text>
                                        {`${item.carDetail.year} ${item.carDetail.make} ${item.carDetail.model}`}
                                    </Text>
                                </View>
                                <View style={styles.tableBodyCellService}>
                                    <Text>
                                        {item.carDetail.serviceNames.join(", ")}
                                    </Text>
                                </View>
                                <View style={styles.tableBodyCellTime}>
                                    <Text>{formatDateToMMMDDYYYY(item.carDetail.entryDate)}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                    <Text fixed style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                        `${pageNumber} / ${totalPages}`
                    )} />
                </Page>
            </Document>
        )
    }

    const previewPdf = async () => {
        const pdfBlob = await pdf(<ThePdfComponent />).toBlob()
        const url = URL.createObjectURL(pdfBlob)
        window.open(url, '_blank')
    }


    return (
        <div className="border border-gray-300 rounded-lg p-3">
            {/* <DebouncedInput /> */}
            <div className="flex justify-between gap-x-2 mt-4 mb-10">
                {jobsData.length > 0 &&
                    <div>
                        <Formik
                            initialValues={{
                                staffId: staffId,
                                customerId: "",
                                serviceId: "",
                            }}
                            validationSchema={validationSchema}
                            onSubmit={(values, { setSubmitting }) => {
                                if (!disableSubmit) {
                                    filterJobHistoryReport(values)
                                } else {
                                    setSubmitting(false)
                                }
                            }}
                        >
                            {({ values, touched, errors }) => (
                                <Form>
                                    <FormContainer className="flex flex-col md:flex-row gap-x-1 items-center">
                                        <div className='flex flex-col xs:flex-row gap-x-2'>
                                            <FormItem
                                                label="Filter by Customer"
                                                invalid={errors.customerId && touched.customerId}
                                                errorMessage={errors.customerId}
                                            >
                                                <Field name="customerId">
                                                    {({
                                                        field,
                                                        form,
                                                    }: FieldProps<YearFormSchema>) => (
                                                        <Select
                                                            field={field}
                                                            form={form}
                                                            size='sm'
                                                            isDisabled={submitting}
                                                            className='xs:w-56 w-full'
                                                            options={customerOptions}
                                                            value={customerOptions.filter(
                                                                (option) =>
                                                                    option.value ===
                                                                    values.customerId
                                                            )}
                                                            onChange={(option) =>
                                                                form.setFieldValue(
                                                                    field.name,
                                                                    option?.value
                                                                )
                                                            }
                                                        />
                                                    )}
                                                </Field>
                                            </FormItem>
                                            <FormItem
                                                label="Filter by Services"
                                                invalid={errors.serviceId && touched.serviceId}
                                                errorMessage={errors.serviceId}
                                            >
                                                <Field name="serviceId">
                                                    {({
                                                        field,
                                                        form,
                                                    }: FieldProps<YearFormSchema>) => (
                                                        <Select
                                                            field={field}
                                                            form={form}
                                                            size='sm'
                                                            className='w-56'
                                                            isDisabled={submitting}
                                                            options={serviceOptions}
                                                            value={serviceOptions.filter(
                                                                (option) =>
                                                                    option.value ===
                                                                    values.serviceId
                                                            )}
                                                            onChange={(option) =>
                                                                form.setFieldValue(
                                                                    field.name,
                                                                    option?.value
                                                                )
                                                            }
                                                        />
                                                    )}
                                                </Field>
                                            </FormItem>
                                        </div>

                                        <div className="flex justify-start items-center gap-x-2">
                                            <Button
                                                icon={<HiOutlineFilter />}
                                                loading={submitting}
                                                disabled={submitting}
                                                variant="solid"
                                                type="submit"
                                                size='sm'
                                            >
                                                {submitting
                                                    ? 'Filtering...'
                                                    : 'Filter'}
                                            </Button>
                                            <Button
                                                icon={<TbFilterOff />}
                                                disabled={submitting}
                                                variant="solid"
                                                type="submit"
                                                size='sm'
                                                onClick={() => dispatch(fetchStaffJobsData(staffId))}
                                            >
                                                Clear
                                            </Button>
                                            <Button
                                                variant="solid"
                                                icon={<FiUpload />}
                                                disabled={submitting}
                                                size='sm'
                                                onClick={previewPdf}
                                            >
                                                Export
                                            </Button>
                                        </div>
                                    </FormContainer>
                                </Form>
                            )}
                        </Formik>
                    </div>
                }
            </div>
            <div>
                <Table>
                    <THead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <Tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <Th
                                            key={header.id}
                                            colSpan={header.colSpan}
                                        >
                                            <>
                                                {header.isPlaceholder ? null : (
                                                    <div
                                                        {...{
                                                            className:
                                                                header.column.getCanSort()
                                                                    ? 'cursor-pointer select-none'
                                                                    : '',
                                                            onClick:
                                                                header.column.getToggleSortingHandler(),
                                                        }}
                                                    >
                                                        {flexRender(
                                                            header.column.columnDef
                                                                .header,
                                                            header.getContext()
                                                        )}
                                                        {
                                                            <Sorter
                                                                sort={header.column.getIsSorted()}
                                                            />
                                                        }
                                                    </div>

                                                )}
                                            </>
                                        </Th>
                                    )
                                })}
                            </Tr>
                        ))}
                    </THead>
                    <TBody>
                        {table.getRowModel().rows.map((row) => {
                            return (
                                <Tr
                                    key={row.id}
                                >
                                    {row.getVisibleCells().map((cell) => {
                                        return (
                                            <Td key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef
                                                        .cell,
                                                    cell.getContext()
                                                )}
                                            </Td>
                                        )
                                    })}
                                </Tr>
                            )
                        })}
                    </TBody>
                </Table>
                <div className="flex items-center justify-between mt-4">
                    <Pagination
                        pageSize={table.getState().pagination.pageSize}
                        currentPage={table.getState().pagination.pageIndex + 1}
                        total={totalData}
                        onChange={onPaginationChange}
                    />
                    <div style={{ minWidth: 130 }}>
                        <Select<PaginationSelectOption>
                            size="sm"
                            isSearchable={false}
                            value={pageSizeOption.filter(
                                (option) =>
                                    option.value ===
                                    table.getState().pagination.pageSize
                            )}
                            options={pageSizeOption}
                            onChange={(option) => onSelectChange(option?.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StaffJobsTable
