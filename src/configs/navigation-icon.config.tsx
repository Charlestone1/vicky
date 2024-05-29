import {
    HiOutlineColorSwatch,
    HiOutlineDesktopComputer,
    HiOutlineTemplate,
    HiOutlineViewGridAdd,
    HiOutlineHome,
} from 'react-icons/hi'
import { GrServices } from 'react-icons/gr'
import { MdDirectionsCar, MdMessage, MdOutlineManageAccounts } from 'react-icons/md'
import { RiUserSettingsLine } from 'react-icons/ri'
import { TiGroup } from 'react-icons/ti'
import { FaAddressBook, FaFileInvoiceDollar, FaRegFileAlt } from 'react-icons/fa'
import { GiLightningShield } from 'react-icons/gi'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    home: <HiOutlineHome />,
    services: <GrServices />,
    warranty: <GiLightningShield />,
    customers: <TiGroup />,
    invoice: <FaFileInvoiceDollar />,
    vehicles: <MdDirectionsCar />,
    jobsqueue: <FaAddressBook />,
    account: <MdOutlineManageAccounts />,
    manage: <RiUserSettingsLine />,
    messaging: <MdMessage />,
    inventory: <FaRegFileAlt />,
    singleMenu: <HiOutlineViewGridAdd />,
    collapseMenu: <HiOutlineTemplate />,
    groupSingleMenu: <HiOutlineDesktopComputer />,
    groupCollapseMenu: <HiOutlineColorSwatch />,
}

export default navigationIcon
