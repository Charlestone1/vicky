/* eslint-disable @typescript-eslint/no-non-null-assertion */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Button, Card, Dialog, Input, Tooltip } from '@/components/ui'
import { useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HiOutlineDotsVertical, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
import { TbFileCheck } from 'react-icons/tb';
import { Link } from 'react-router-dom';
import AddCategory from './AddCategory';
import EditCategory from './EditCategory';


type Inventory = {
    inventoryName: string
    minimumTreshold: number,
    quantity: number,
    id: string,
    supplierDetails: {
        name: string,
        email: string,
        phoneNo: number
    }
    createdOn: string;
    _id: string
};

type DataItem = {
    _id: string;
    categoryName: string;
    urlTag: string;
    id: string;
    inventories: Inventory[];
};

const data: DataItem[] = [
    {
        _id: "66223af85239b7f64932305a",
        categoryName: "Auto films",
        urlTag: "auto_films",
        id: "66223af85239b7f64932305a",
        inventories: [
            {
                inventoryName: "Auto 123",
                minimumTreshold: 30,
                quantity: 102,
                id: "66223af85239b7f64932305aa",
                createdOn: "25-08-1756",
                _id: "66223af85239b7f64932305aa",
                supplierDetails: {
                    name: "Master Vendors",
                    email: "email@gmail.com",
                    phoneNo: 12345689
                },
            },
            {
                inventoryName: "Auto 234",
                minimumTreshold: 25,
                quantity: 125,
                id: "66223af85239b7f64932305ac",
                createdOn: "25-08-1756",
                _id: "66223af85239b7f64932305ac",
                supplierDetails: {
                    name: "Minister Supplies",
                    email: "email@gmail.com",
                    phoneNo: 12345680
                }
            }
        ]
    },
    {
        _id: "66223af85239b7f64932305b",
        categoryName: "PPF films",
        urlTag: "ppf_films",
        id: "66223af85239b7f64932305b",
        inventories: [
            {
                inventoryName: "Auto 123",
                minimumTreshold: 30,
                quantity: 102,
                id: "66223af85239b7f64932305bb",
                createdOn: "25-08-1756",
                _id: "66223af85239b7f64932305bb",
                supplierDetails: {
                    name: "Master Vendors",
                    email: "email@gmail.com",
                    phoneNo: 12345689
                },
            },
            {
                inventoryName: "Auto 234",
                minimumTreshold: 25,
                quantity: 125,
                id: "66223af85239b7f64932305c",
                createdOn: "25-08-1756",
                _id: "66223af85239b7f64932305c",
                supplierDetails: {
                    name: "Minister Supplies",
                    email: "email@gmail.com",
                    phoneNo: 12345680
                }
            }
        ]

    },
    {
        _id: "66223af85239b7f64932305c",
        categoryName: "Manu films",
        urlTag: "manu_films",
        id: "66223af85239b7f64932305c",
        inventories: [
            {
                inventoryName: "Inventory 123",
                minimumTreshold: 30,
                quantity: 102,
                id: "66223af85239b7f64932305cc",
                createdOn: "25-08-1756",
                _id: "66223af85239b7f64932305cc",
                supplierDetails: {
                    name: "Master Vendors",
                    email: "email@gmail.com",
                    phoneNo: 12345689
                },
            },
            {
                inventoryName: "Inventory 234",
                minimumTreshold: 25,
                quantity: 125,
                id: "66223af85239b7f64932305dc",
                createdOn: "25-08-1756",
                _id: "66223af85239b7f64932305dc",
                supplierDetails: {
                    name: "Minister Supplies",
                    email: "email@gmail.com",
                    phoneNo: 12345680
                }
            }
        ]

    },
    {
        _id: "66223a4d5239b7f649323059",
        categoryName: "Bright films",
        urlTag: "bright_films",
        id: "66223a4d5239b7f649323059",
        inventories: [
            {
                inventoryName: "Inventor 345",
                minimumTreshold: 30,
                quantity: 102,
                id: "66223af85239b7f64932305sb",
                createdOn: "25-08-1756",
                _id: "66223af85239b7f64932305sb",
                supplierDetails: {
                    name: "Master Vendors",
                    email: "email@gmail.com",
                    phoneNo: 12345689
                },
            },
            {
                inventoryName: "Inventor 456",
                minimumTreshold: 25,
                quantity: 125,
                id: "66223af85239b7f64932305c",
                createdOn: "25-08-1756",
                _id: "66223af85239b7f64932305c",
                supplierDetails: {
                    name: "Minister Supplies",
                    email: "email@gmail.com",
                    phoneNo: 12345680
                }
            }
        ]

    },
    {
        _id: "66223af85239b7f64932305kk",
        categoryName: "Auto films",
        urlTag: "auto_films",
        id: "66223af85239b7f64932305kk",
        inventories: [
            {
                inventoryName: "Auto 123",
                minimumTreshold: 30,
                quantity: 102,
                id: "66223af85239b7f64932305sb",
                createdOn: "25-08-1756",
                _id: "66223af85239b7f64932305sb",
                supplierDetails: {
                    name: "Master Vendors",
                    email: "email@gmail.com",
                    phoneNo: 12345689
                },
            },
            {
                inventoryName: "Auto 234",
                minimumTreshold: 25,
                quantity: 125,
                id: "66223af85239b7f64932305c",
                createdOn: "25-08-1756",
                _id: "66223af85239b7f64932305c",
                supplierDetails: {
                    name: "Minister Supplies",
                    email: "email@gmail.com",
                    phoneNo: 12345680
                }
            },
            {
                inventoryName: "Auto 234",
                minimumTreshold: 25,
                quantity: 125,
                id: "66223af85239b7f64932305c",
                createdOn: "25-08-1756",
                _id: "66223af85239b7f64932305c",
                supplierDetails: {
                    name: "Minister Supplies",
                    email: "email@gmail.com",
                    phoneNo: 12345680
                }
            }
        ]

    }
]


const Categories = () => {
    const [dialogIsOpen, setIsOpen] = useState(false)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [updateCategoryName, setUpdateCategoryName] = useState<{
        name: string
        id: string
    }>()

    const openAddDialog = () => {
        setIsOpen(true)
    }

    const onDialogClose = () => {
        setIsOpen(false)
    }
    const openEditDialog = () => {
        setEditDialogOpen(true)
    }

    const onEditDialogClose = () => {
        setEditDialogOpen(false)
    }
    return (
        <div>
            <div className='flex justify-between items-center'>
                <div className='w-52'>
                    <Input type="search" name="search" placeholder='search category...' />
                </div>
                <Button
                    // loading={isSubmitting}
                    variant="solid"
                    type="submit"
                    onClick={() => openAddDialog()}
                >
                    + Add Category
                </Button>
                <Dialog
                    isOpen={dialogIsOpen}
                    shouldCloseOnOverlayClick={false}
                    shouldCloseOnEsc={false}
                    bodyOpenClassName="overflow-hidden"
                    width={550}
                    onClose={onDialogClose}
                    onRequestClose={onDialogClose}
                >
                    <h5 className="mb-4">Create New Category</h5>
                    <AddCategory setIsOpen={setIsOpen} />
                </Dialog>
            </div>
            <div className='grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 mt-4'>
                {data?.map((category) => (
                    <div key={category.id} className='relative group'>
                        <Link to={`/inventory/${category.id}`} className='' >
                            <Card bordered className=' group-hover:bg-[#F2F2FD]'>
                                <div className='flex'>
                                    <h6 className="truncate mb-3 font-bold text-gray-600 ">{category.categoryName}</h6>
                                    <span className='mr-6'></span>
                                </div>
                                <div className="min-h-[50px] flex justify-between">
                                    <TbFileCheck size={60} className='' />
                                    <div className="flex items-center justify-end mt-4">
                                        <p className='font-bold text-lg text-gray-400 '>{`${category.inventories.length} items`}</p>
                                    </div>
                                </div>
                            </Card>

                        </Link>
                        <Button
                            icon={<HiOutlinePencil />}
                            variant="plain"
                            type="submit"
                            shape='circle'
                            className='absolute top-4 right-4'
                            onClick={() => {
                                setUpdateCategoryName({
                                    name: category.categoryName,
                                    id: category._id
                                })
                                openEditDialog()
                            }}
                        />

                    </div>
                ))}
            </div>
            <Dialog
                isOpen={editDialogOpen}
                shouldCloseOnOverlayClick={false}
                shouldCloseOnEsc={false}
                bodyOpenClassName="overflow-hidden"
                width={550}
                onClose={onEditDialogClose}
                onRequestClose={onEditDialogClose}
            >
                <h5 className="mb-4">Modify Category</h5>
                <EditCategory data={updateCategoryName!} setIsOpen={setEditDialogOpen} />
            </Dialog>
        </div>
    )
}

export default Categories