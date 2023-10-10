exports.ToLocalTime = (time) => {
    const date = new Date(time);
    return date.toLocaleString("th-TH");
};

exports.IsData = (data) => {
    if (data !== null && data !== undefined && data !== "") return data;
};

exports.IsDataArray = (data) => {
    if (data !== null && data !== undefined && data.length > 0) return data;
};

exports.IsDataObject = (data) => {
    if (data !== null && data !== undefined && Object.keys(data).length > 0) return data;
};

exports.IsDataObjectArray = (data) => {
    if (data !== null && data !== undefined && data.length > 0 && Object.keys(data[0]).length > 0)
        return data;
};

exports.IsHidden = (data) => {
    if (data === null || data === undefined || data === "") return data ? true : false;
};

exports.Image = ({ src, alt }) => {

    return (
        <img
            src={src? src:"/images/404.png"}
            alt={alt ? alt:"404"}
        />
    );
}