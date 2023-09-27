const {ReactInternetSpeedMeter} = require("react-internet-meter");


exports.getDownloadSpeed = async (req, res) => {
    try {
        let speed;
        let ping;
        ReactInternetSpeedMeter({
            txtMainHeading: 'Opps...',
            outputType: 'alert',
            customClassName: '',
            pingInterval: 10000,
            thresholdUnit: 'megabyte',
            threshold: 7,
            txtSubHeading: 'Diconnected from internet',
            imageUrl: 'http://localhost:3001/favicon.png',
            downloadSize: '1781287',
            callbackFunctionOnNetworkDown: (data) => ping = data,
            callbackFunctionOnNetworkTest: (data) => speed = data,
            callbackFunctionOnError: () => console.log('error in downloading image')
        })

        res.status(200).json({ speed, ping });

    } catch (error) {
        res.status(500).json({ error: "server error", message: error.message });
    }
};

