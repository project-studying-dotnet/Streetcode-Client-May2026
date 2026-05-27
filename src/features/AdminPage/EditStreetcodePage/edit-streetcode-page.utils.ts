export const parseStreetcodeId = (rawStreetcodeId: string | undefined): number | null => {
    if (rawStreetcodeId === undefined) {
        return null;
    }

    const parsedId = Number(rawStreetcodeId);

    if (Number.isNaN(parsedId) || parsedId <= 0) {
        return null;
    }

    return parsedId;
};

export const isValidStreetcodeId = (rawStreetcodeId: string | undefined): boolean => (
    parseStreetcodeId(rawStreetcodeId) !== null
);
