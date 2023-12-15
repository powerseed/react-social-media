import { useCallback, useState } from 'react'
import { FileWithPath, useDropzone } from 'react-dropzone'

type FileUploaderProps = {
    fieldOnChange: (file: File) => void,
    mediaUrl: string
}

const FileUploader = ({ fieldOnChange, mediaUrl }: FileUploaderProps) => {
    const [fileUrl, setFileUrl] = useState('');

    const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
        setFileUrl(URL.createObjectURL(acceptedFiles[0]));
        fieldOnChange(acceptedFiles[0]);
    }, [])

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', 'jpeg', 'jpg', '.svg']
        }
    })

    return (
        <div {...getRootProps()} className='flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer'>
            <input {...getInputProps()} className='cursor-pointer' />
            {fileUrl ? (
                <img className='file_uploader-img' src={fileUrl} alt="uploaded-file" />
            ) : (
                <div className='file_uploader-box'>
                    <img src="/public/assets/icons/file-upload.svg" alt="file-upload" width={96} height={77} />
                    <h3 className='text-light-4 small-regular mb-6'>SVG, PNG, JPG</h3>
                </div>
            )
            }
        </div>
    )
}

export default FileUploader