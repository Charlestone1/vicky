import { useState, Suspense, lazy, useEffect } from 'react'
import Tabs from '@/components/ui/Tabs'
import AdaptableCard from '@/components/shared/AdaptableCard'
import Container from '@/components/shared/Container'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui'
import { TiRefresh } from 'react-icons/ti'
import { fetchServiceData } from '@/store/slices/companyservices/companyServicesSlice'
import { useAppDispatch } from '../account/ActivityLog/store'

// const GetServices = lazy(() => import('./components/GetServices'))
const DealershipService = lazy(() => import('./components/DealershipService'))
const SingleTint = lazy(() => import('./components/SingleTint'))
const FullTint = lazy(() => import('./components/FullTint'))

const { TabNav, TabList } = Tabs

const serviceMenu: Record<
    string,
    {
        label: string
        path: string
    }
> = {
    dealership: { label: 'Dealership', path: 'dealership' },
    singletint: { label: 'Single Tint', path: 'singletint' },
    fulltint: { label: 'Full Tint', path: 'fulltint' },
}

const Services = () => {
    const [currentTab, setCurrentTab] = useState('dealership');

    const dispatch = useAppDispatch()

    const navigate = useNavigate()

    const location = useLocation()

    const path = location.pathname.substring(
        location.pathname.lastIndexOf('/') + 1
    )

    useEffect(() => {
        setCurrentTab(path)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onTabChange = (val: string) => {
        setCurrentTab(val)
        navigate(`/services/${val}`)
    }
    return (
        <Container>
            <AdaptableCard>
                <Tabs value={currentTab} onChange={(val) => onTabChange(val)}>

                    <div className="flex items-center justify-between mb-4">
                        <h2>Services</h2>
                        <Button
                            icon={<TiRefresh />}
                            variant="solid"
                            size='sm'
                            onClick={() => dispatch(fetchServiceData())}
                        />
                    </div>
                    <TabList>
                        {Object.keys(serviceMenu).map((key) => (
                            <TabNav key={key} value={key}>
                                {serviceMenu[key].label}
                            </TabNav>
                        ))}
                    </TabList>
                </Tabs>
                <div className="px-4 py-6">
                    <Suspense fallback={<></>}>
                        {currentTab === 'dealership' && (
                            <DealershipService />
                        )}
                        {currentTab === 'singletint' && (
                            <SingleTint />
                        )}
                        {currentTab === 'fulltint' && (
                            <FullTint />
                        )}
                    </Suspense>
                </div>
            </AdaptableCard>
        </Container>
    )
}

export default Services
