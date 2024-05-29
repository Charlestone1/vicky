// import Avatar from '@/components/ui/Avatar'
import Dropdown from '@/components/ui/Dropdown'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import useAuth from '@/utils/hooks/useAuth'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { HiOutlineLogout } from 'react-icons/hi'
// import { HiOutlineLogout, HiOutlineUser } from 'react-icons/hi'
import type { CommonProps } from '@/@types/common'

// redux store item 
import { useSelector } from 'react-redux';
import { RootState } from '@/store'


type DropdownList = {
    label: string
    path: string
    icon: JSX.Element
}

interface CircularAvatarProps {
    string1: string;
    string2: string;
}

const CircularAvatar: React.FC<CircularAvatarProps> = ({ string1, string2 }) => {
    // Extracting the first letters of the strings
    const firstLetter1 = string1.charAt(0).toUpperCase();
    const firstLetter2 = string2.charAt(0).toUpperCase();

    return (
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <div className="flex justify-center items-center">
                <span className="text-xl font-bold">{firstLetter1}</span>
                <span className="text-xl font-bold">{firstLetter2}</span>
            </div>
        </div>
    );
};

const dropdownItemList: DropdownList[] = []

const _UserDropdown = ({ className }: CommonProps) => {

    // My user details
    const { user } = useSelector((state: RootState) => state.auth)
    const { signOut } = useAuth()

    const UserAvatar = (
        <div className={classNames(className, 'flex items-center gap-2')}>
            {/* <Avatar src={user.avatarUrl} size={32} shape="circle" icon={<HiOutlineUser />} /> */}
            {user.firstName && user.lastName &&
                <CircularAvatar string1={user.firstName} string2={user.lastName} />
            }
            <div className="hidden md:block">
                <div className="font-bold capitalize">{user.firstName} {user.lastName}</div>
                <div className="text-xs capitalize">{user.role}</div>
            </div>
        </div>
    )

    return (
        <div>
            <Dropdown
                menuStyle={{ minWidth: 240 }}
                renderTitle={UserAvatar}
                placement="bottom-end"
            >
                <Dropdown.Item variant="header">
                    <div className="py-2 px-3 flex items-center gap-2">
                        {/* <Avatar src={user.avatarUrl} shape="circle" icon={<HiOutlineUser />} /> */}
                        <div>
                            <div className="font-bold text-gray-900 dark:text-gray-100 capitalize">
                                {user.firstName} {user.lastName}
                            </div>
                            <div className="text-xs">{user.email}</div>
                        </div>
                    </div>
                </Dropdown.Item>
                <Dropdown.Item variant="divider" />
                {dropdownItemList.map((item) => (
                    <Dropdown.Item
                        key={item.label}
                        eventKey={item.label}
                        className="mb-1 px-0"
                    >
                        <Link
                            className="flex h-full w-full px-2"
                            to={item.path}
                        >
                            <span className="flex gap-2 items-center w-full">
                                <span className="text-xl opacity-50">
                                    {item.icon}
                                </span>
                                <span>{item.label}</span>
                            </span>
                        </Link>
                    </Dropdown.Item>
                ))}
                {/* <Dropdown.Item variant="divider" /> */}
                <Dropdown.Item
                    eventKey="Sign Out"
                    className="gap-2"
                    onClick={signOut}
                >
                    <span className="text-xl opacity-50">
                        <HiOutlineLogout />
                    </span>
                    <span>Sign Out</span>
                </Dropdown.Item>
            </Dropdown>
        </div>
    )
}

const UserDropdown = withHeaderItem(_UserDropdown)

export default UserDropdown
