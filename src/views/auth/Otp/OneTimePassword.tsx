import OneTimePass from './OtpForm'

const OneTimePassword = () => {

    return (
        <>
            <div className="mb-6">
                <h3 className="mb-1">OTP</h3>
                <p>An OTP was sent to your email address</p>
            </div>
            <OneTimePass disableSubmit={false} />
        </>
    )
}

export default OneTimePassword