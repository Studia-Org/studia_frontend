import React, { useEffect, useState } from 'react';

const ImageDisplay = ({ fileData }) => {
    const [imageSrc, setImageSrc] = useState(null);

    useEffect(() => {
        if (fileData) {
            const reader = new FileReader();

            reader.onload = () => {
                setImageSrc(reader.result);
            };

            reader.readAsDataURL(fileData.file);
        }
    }, [fileData]);

    return (
        <div>
            {imageSrc ? (
                <img className='h-[30rem] w-full object-cover rounded-md' src={imageSrc} alt={fileData.filename} />
            ) : (
                <p>Loading image...</p>
            )}
        </div>
    );
};

export default ImageDisplay;
