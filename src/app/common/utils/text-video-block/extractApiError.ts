export const extractApiError = (error: any): string => {
  const responseData = error?.response?.data;

  let errorText = 'Невідома помилка';

  if (!responseData) return errorText;

  if (
    responseData.reasons &&
    Array.isArray(responseData.reasons) &&
    responseData.reasons.length > 0
  ) {
    return responseData.reasons
      .map((r: any) => r.message)
      .join(', ');
  }

  if (responseData.errors) {
    if (Array.isArray(responseData.errors)) {
      return responseData.errors.join(', ');
    }

    return Object.values(responseData.errors).flat().join(', ');
  }

  if (responseData.message) return responseData.message;

  if (typeof responseData === 'string') return responseData;

  return JSON.stringify(responseData);
};