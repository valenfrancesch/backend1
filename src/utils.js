export const processError = (res, error) => {
    console.log(error);
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json(
        {
            error: 'Unexpected server error - Please try again later, or contact your administrator',
            detail: `${error.message}`
        }
    )
}