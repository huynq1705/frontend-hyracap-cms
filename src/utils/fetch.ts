export const handleGetDataCommon = async (
  fnGetData: (...args: any) => any,
  fnConvertData: (...args: any) => any,
  setData: (...args: any) => void,
  param?: any,
) => {
  try {
    const params = param ?? {
      page: 1,
      take: 999,
    };
    const response = await fnGetData(params);
    if (response) {
      const convert_data = fnConvertData(response.data);
      setData(convert_data);
      return convert_data;
    }
  } catch (e) {
    throw e;
  }
};
