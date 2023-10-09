

export const ToLocalTime = (time) => {
    const date = new Date(time);
    return date.toLocaleString("th-TH");
};

export const IsData = (data) => {
    if (data !== null && data !== undefined && data !== "") return data;
};

export const IsDataArray = (data) => {
    if (data !== null && data !== undefined && data.length > 0) return data;
};

export const IsDataObject = (data) => {
    if (data !== null && data !== undefined && Object.keys(data).length > 0) return data;
};

export const IsDataObjectArray = (data) => {
    if (data !== null && data !== undefined && data.length > 0 && Object.keys(data[0]).length > 0)
        return data;
};

export const IsHidden = (data) => {
    if (data === null || data === undefined || data === "") return data ? true : false;
};

export const Image = ({ src, alt }) => {

    return (
        <img
            src={src? src:"/images/404.png"}
            alt={alt ? alt:"404"}
        />
    );
}