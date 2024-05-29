import React from 'react'
import { HiOutlineChevronDoubleRight } from 'react-icons/hi2'
import { Link, useLocation } from 'react-router-dom'

interface BreadcrumbProps {
    crumbs: { label: string; path: string }[]
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ crumbs }) => {
    const { pathname } = useLocation()
    return (
        <div className="flex items-center gap-1 mb-5">
            {crumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                    <Link
                        to={crumb.path}
                        className="text-[15px]"
                        style={{
                            color:
                                crumb.path === pathname ? '#4F46E5' : 'inherit',
                        }}
                    >
                        {crumb.label}
                    </Link>
                    {index < crumbs.length - 1 && (
                        <HiOutlineChevronDoubleRight className="text-[10px]" />
                    )}
                </React.Fragment>
            ))}
        </div>
    )
}

export default Breadcrumb