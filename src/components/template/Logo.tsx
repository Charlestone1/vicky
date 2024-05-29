import classNames from 'classnames'
import { APP_NAME } from '@/constants/app.constant'
import type { CommonProps } from '@/@types/common'
import logo1 from '../../../public/img/logo/logo-light-full.png'

interface LogoProps extends CommonProps {
    type?: 'full' | 'streamline'
    mode?: 'light' | 'dark'
    imgClass?: string
    logoWidth?: number | string
}

// const LOGO_SRC_PATH = '/img/logo/'

const Logo = (props: LogoProps) => {
    const {
        // type = 'full',
        // mode = 'light',
        className,
        imgClass,
        style,
        logoWidth = 'auto',
    } = props

    return (
        <div
            className={classNames('logo', className)}
            style={{
                ...style,
                ...{ width: logoWidth },
            }}
        >
            {/* <h5 className="text-xl mb-2">ASWT</h5> */}

            {/* <img
                className={imgClass}
                src={`${LOGO_SRC_PATH}logo-${mode}-${type}.png`}
                alt={`${APP_NAME} logo`}
            /> */}
            <img className={imgClass} src={logo1} alt={`${APP_NAME} logo`} />
        </div>
    )
}

export default Logo
