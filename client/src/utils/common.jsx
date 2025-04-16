import Swal from 'sweetalert2'
import toast from 'react-hot-toast';
import ReactDOMServer from 'react-dom/server';
import { FaExclamationTriangle } from 'react-icons/fa';

export const showToaster = (status, message) => {
    toast.dismiss();
    const formattedMessage = message.replace(/\.\s*/g, ".\n").trim();
    const title =
        status === 1
            ? "Success!"
            : status === 0
                ? "Failure!"
                : "";

    const msg = (
        <div className="max-w-xs whitespace-pre-line text-left">
            <strong className="block mb-1">{title}</strong>
            {formattedMessage}
        </div>
    );

    if (status) {
        toast.success(msg, { autoClose: 6000 });
    } else {
        toast.error(msg, { autoClose: 6000 });
    }
};

export const showConfirmDialog = ({
    icon = <FaExclamationTriangle className="w-16 h-16 text-red-500" />,
    title = 'Are you sure?',
    message,
    confirmButtonText = 'Confirm',
    cancelButtonText = 'Cancel',
    onConfirm,
    onCancel,
    swalOptions = {},
    customClass = {
        confirmButton: 'bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500',
        cancelButton: 'bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400'
    }
}) => {
    const titleContent = ReactDOMServer.renderToStaticMarkup(
        <div className="flex flex-col items-center gap-2">
            <div className="text-6xl">{icon}</div>
            {title && <span className="text-lg font-semibold text-gray-800">{title}</span>}
        </div>
    );

    Swal.fire({
        title: titleContent,
        html: message,
        showCancelButton: true,
        confirmButtonText,
        cancelButtonText,
        focusConfirm: false,
        buttonsStyling: false, // Disable default styling
        customClass,
        ...swalOptions
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await Promise.resolve(onConfirm());
            } catch (error) {
                Swal.showValidationMessage('An error occurred. Please try again.');
            }
        } else if (onCancel) {
            onCancel();
        }
    });
};

export const handleErrors = (error) => {
    console.error(error);
    if (error.response && error.response.data)
        showToaster(0, error.response.data.message || error.response.data.error)
    else if (error.status === 304)
        showToaster(0, 'No changes detected.')
    else
        showToaster(0, 'Something Went Wrong')
}

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formatter = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
    return formatter.format(date);
}
