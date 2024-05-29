import { Button, Card, Tooltip } from '@/components/ui'
import React from 'react'
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'

const CategoryCard = () => {
    return (
        <Card bordered>
            <h6 className="truncate mb-4">My Title Text</h6>
            <div className="min-h-[60px]">

            </div>
            <div className="flex items-center justify-end mt-4">

                <div className="flex">
                    <Tooltip title="Delete">
                        <Button
                            shape="circle"
                            variant="plain"
                            size="sm"
                            icon={<HiOutlineTrash />}
                        // onClick={() =>
                        //     onArticleDelete(message.id)
                        // }
                        />
                    </Tooltip>
                    <Tooltip title="Edit">
                        <Button
                            shape="circle"
                            variant="plain"
                            size="sm"
                            icon={<HiOutlinePencil />}
                        // onClick={() =>
                        //     onArticleEdit(message.id)
                        // }
                        />
                    </Tooltip>
                </div>
            </div>
        </Card>
    )
}

export default CategoryCard