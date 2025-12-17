


export const fileUpload = async (
    files: File[],
    filePath: string
): Promise<string[]> => {
    try {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('images', file);
        });
        formData.append('filePath', filePath);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
            method: 'POST',
            body: formData,
        });
        if (!res.ok) {
            throw new Error('Image upload failed');
        }

        const data = await res.json();
        console.log("Upload file", data)

        return data;
    } catch (err) {
        console.error('Image Upload Error:', err);
        throw err;
    }
};


export const videoUpload = async (
    file: File,
    filePath: string
): Promise<string> => {
    try {
        const formData = new FormData();
        formData.append("video", file);
        formData.append("filePath", filePath);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/video`, {
            method: "POST",
            body: formData,
        });

        if (!res.ok) {
            throw new Error("Video upload failed");
        }

        const data = await res.text();
        return data;
    } catch (err) {
        console.error("Video Upload Error:", err);
        throw err;
    }
};

