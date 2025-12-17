export const truncateText = (text: string, maxLength: number = 50) => {
    if (!text) return "N/A";
    return text.length > maxLength
        ? `${text.substring(0, maxLength)}...`
        : text;
};