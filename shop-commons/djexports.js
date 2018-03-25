import { PageRender, RootPageRender } from './utils/page-render';
import { BaseViewModel, ContentProvider } from './view-models/base-view-model';
import AppLayout from './components/base/app-layout/app-layout';
import RootSpin from './components/base/root-spin';
import Services from './services/main';
import * as utilsCommon from './utils/common';
import HttpUtil from './utils/http';
import Ajax from './utils/ajax';
import Loading from './view-models/load';
import { convert, promiseConvert } from './utils/convert';
import * as BaseSelect from './models/base-select';
import BaseImage from './components/base/image';
import { provide } from './utils/provide';
import ClipboardBtn from './components/react-clipboard';
import CustomTable from './components/drp/custom-table';
import EditArea from './components/drp/edit-area';
import StrategyTypeSelect from './components/drp/strategy-type-select';
import AutoAdjustModal from './components/drp/auto-adjusting-modal';
import SelectDown from './components/base/select-down';
import SpuSearch from './components/drp/spu-search';
import OpLogController from './components/drp/op-log-controler';
import ChannelSelect from './components/drp/channel-select';
import WarehouseSelect from './components/drp/warehouse-select';
import ChannelStorageSelect from './components/drp/channel-storage-select';
import ReverseConfirm from './components/drp/reverse-confirm';
import Comments from './components/drp/comments';
import Text from './components/drp/text';
import SpuEdit from './components/drp/spu-edit';
import SpuEditModal from './components/drp/spu-edit-modal';
import SpuModal from './components/drp/spu-modal';
import Tips from './components/drp/tips';
import formatMoney from './utils/format-money';
import Select from './components/drp/select';
import SupplierSelect from './components/drp/supplier-select';
import InputGoodsNum from './components/drp/input-goods-num';
import InputNumber from './components/drp/input-number';
import SpuNumberEditModal from './components/drp/spu-number-edit-modal';
import BillRelation from './components/drp/bill-relation';
import { BillTypeKey } from './components/drp/bill-relation-config';
import Printer from './components/drp/printer/printer-modal/print-select-v';
import defineAction from './utils/defineAction';

const exportItems = {
    PageRender,
    RootPageRender,
    AppLayout,
    RootSpin,
    BaseViewModel,
    ContentProvider,
    Services,
    utilsCommon,
    HttpUtil,
    Ajax,
    Loading,
    convert,
    promiseConvert,
    BaseSelect,
    BaseImage,
    defineAction,
    provide,
    ClipboardBtn,
    //drp
    CustomTable,
    EditArea,
    StrategyTypeSelect,
    AutoAdjustModal,
    SelectDown,
    SpuSearch,
    OpLogController,
    ChannelSelect,
    WarehouseSelect,
    ChannelStorageSelect,
    ReverseConfirm,
    Comments,
    Text,
    SpuEdit,
    SpuEditModal,
    SpuModal,
    Tips,
    formatMoney,
    Select,
    SupplierSelect,
    InputGoodsNum,
    InputNumber,
    SpuNumberEditModal,
    BillRelation,
    BillTypeKey,
    Printer
};

export default exportItems;