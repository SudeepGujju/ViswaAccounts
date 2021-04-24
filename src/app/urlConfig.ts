// Calling API(BE) using configuration specified in proxy.config.json
export const APIPort = 8000;
export const APIBaseUrl = 'http://localhost';
// export const Url = APIBaseUrl + ':' + APIPort + '/api';
export const Url = '/api';

// export const Url = '/api';
export const RegisterUrl = Url + '/' + 'register';
export const LoginUrl = Url + '/' + 'auth/login';
export const RefreshTokenUrl = Url + '/' + 'auth/refresh';
export const LogoutUrl = Url + '/' + 'auth/logout';

export const userUrl = Url + '/' + 'users';
export const userPermUrl = userUrl + '/permissions';

export const reportFilesUrl = Url + '/' + 'reports/fileList';
export const reportFileDataUrl = Url + '/' + 'reports/fileData';

export const groupUrl = Url + '/groups';
export const groupUploadUrl = groupUrl + '/upload';
export const groupCodeAvailUrl = groupUrl + '/codeAvailable';
export const groupDropdownUrl = groupUrl + '/dropdown';

export const accountUrl = Url + '/accounts';
export const accountCodeAvailUrl = accountUrl + '/codeAvailable';
export const accountDropdownUrl = accountUrl + '/dropdown';
export const accountUploadUrl = accountUrl + '/upload';
export const accountOpenBalUrl = accountUrl + '/openingBalance';

export const bankUrl = Url + '/' + 'bank';
export const bankSearchUrl = bankUrl + '/search';
export const bankNxtRecIDUrl = bankUrl + '/nextRecordID';

export const inventoryUrl = Url + '/inventories';
export const inventorySearchUrl = inventoryUrl + '/search';
export const inventoryNxtRecIDUrl = inventoryUrl + '/nextRecordID';
export const inventoryUploadUrl = inventoryUrl + '/upload';

export const genVouchUrl = Url + '/general-vouchers';
export const genVouchNxtRecIDUrl = genVouchUrl + '/nextRecordID';
export const fileUploadUrl = Url + '/' + 'file/upload';

export const glPrepareUrl = Url + '/' + 'gl/prepare';
export const glAccountCopyUrl = Url + '/' + 'gl/accountCopy';
export const glTrailBalanceUrl = Url + '/' + 'gl/trailBalance';
export const glTradingUrl = Url + '/' + 'gl/trading';
export const glProfitNLossUrl = Url + '/' + 'gl/profitnloss';
export const glBalanceSheetUrl = Url + '/' + 'gl/balanceSheet';

export const productUrl = Url + '/products';
export const productSearchUrl = productUrl + '/search';
export const productUserSearchUrl = productUrl + '/search/user';
export const productUploadUrl = productUrl + '/upload';

export const purchaseUrl = Url + '/order/purchase';
