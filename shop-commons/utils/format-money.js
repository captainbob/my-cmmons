import { StringUtils } from 'djmodules-utils';

export default function (money) {
    return StringUtils.numberFormat(money, 2, ".", ",");
}