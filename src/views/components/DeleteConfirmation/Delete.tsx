import { Button } from '@/components/ui'
import { useNavigate } from 'react-router-dom'

interface DeleteConfirmationParams {
    onClose: () => void
    path: string
    // setIsOpen: (value: boolean) => void
}

const DeleteConfirmation: React.FC<DeleteConfirmationParams> = ({
    onClose,
    path,
    // setIsOpen,
}) => {
    const navigate = useNavigate()

    //   function closeDialogBox() {
    //       setIsOpen(false)
    //   }
    return (
        <div>
            <h4 className="mb-16">Are you sure you want to cancel?</h4>
            <div className="col-span-2 text-right mt-6">
                <Button
                    className="ltr:mr-0 rtl:ml-2"
                    variant="plain"
                    type="button"
                    color="red-400"
                    onClick={() => onClose()}
                // onClick={closeDialogBox}
                // size="sm"
                >
                    No
                </Button>
                <Button
                    variant="solid"
                    type="button"
                    color="red-600"
                    onClick={() => navigate(path)}
                // size="sm"
                >
                    Yes, I want to cancel
                </Button>
            </div>
        </div>
    )
}

export default DeleteConfirmation