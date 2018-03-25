import { createWebService } from './base';

// /rs/finance/paymentQuery
const baseService = createWebService('finance/paymentQuery');

// POST / getPaymentItemDetail
export const fetchGetPaymentItemDetail = baseService.getPaymentItemDetail('post');