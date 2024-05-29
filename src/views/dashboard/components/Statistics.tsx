import Card from '@/components/ui/Card'
import { NumericFormat } from 'react-number-format'
import GrowShrinkTag from '@/components/shared/GrowShrinkTag'
// import { useAppSelector } from '@/store'
// import dayjs from 'dayjs'

type StatisticsCardProps = {
    data?: {
        value: number
        growShrink: number
    }
    label: string
    valuePrefix?: string
    // date: number
}

type StatisticsProps = {
    data?: {
        revenue?: {
            value: number
            growShrink: number
        }
        orders?: {
            value: number
            growShrink: number
        }
        purchases?: {
            value: number
            growShrink: number
        }
    }
}

const StatisticsCard = ({
    data = { value: 0, growShrink: 0 },
    label,
    valuePrefix,
}: // date,
StatisticsCardProps) => {
    return (
        <Card>
            <h6 className="font-semibold mb-4 text-sm">{label}</h6>
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="font-bold">
                        <NumericFormat
                            thousandSeparator
                            // allowNegative={false}
                            displayType="text"
                            value={data.value}
                            prefix={valuePrefix}
                        />
                    </h3>
                    <p>
                        vs. 3 months prior to{' '}
                        <span className="font-semibold">
                            23 Jan {/* {dayjs(date).format('DD MMM')} */}
                        </span>
                    </p>
                </div>
                <GrowShrinkTag value={data.growShrink} suffix="%" />
            </div>
        </Card>
    )
}

const Statistics = ({ data = {} }: StatisticsProps) => {
    // const startDate = useAppSelector(
    //     (state) => state.salesDashboard.data.startDate
    // )

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <StatisticsCard
                data={data.revenue}
                valuePrefix="$"
                label="Revenue"
                // date={startDate}
            />
            <StatisticsCard
                data={data.orders}
                label="Entries"
                // date={startDate}
            />
            <StatisticsCard
                data={data.purchases}
                valuePrefix="$"
                label="Unpaid"
                // date={startDate}
            />
        </div>
    )
}

export default Statistics
