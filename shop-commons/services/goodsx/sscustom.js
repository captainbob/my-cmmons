import { createWebService } from '../base';
// /rs/goodsx / scustomcat
const baseService = createWebService('goodsx/scustomcat');
// POST / get_list 查询商家自定义类目列表
// brandId (required) 品牌编号	form	string
// catCode 类目编号	form	string
// parentCatCode 父类目编号	form	string
// catName 类目名称	form	string
// pageNum (required) 页码数	form	integer
// pageSize (required) 每页显示数	form	integer
export const getList = baseService.get_list('post');
// POST / add_custom_cat POST /add_custom_cat 新增商家自定义类目
// brandId (required) 品牌编号	form	string
// catCode 类目编号	form	string
// parentCatCode 父类目编号	form	string
// catName 类目名称	form	string
// sysCatId (required) 平台类目ID	form	number
export const addCustomCat = baseService.add_custom_cat('post');
// POST / modify_custom_cat POST /modify_custom_cat 修改商家自定义类目
// brandId (required) 品牌编号	form	string
// catCode 类目编号	form	string
// parentCatCode 父类目编号	form	string
// catName 类目名称	form	string
export const modifyCustomCat = baseService.modify_custom_cat('post');
// GET /get_parent_List
// brandId (required) 品牌编号	query	string
// relatedSysCat 为null则显示所有，为true则显示已关联平台类目的大类，为false则显示未关联平台类目的大类	query	integer
export const getParentList = baseService.get_parent_List('get');
// GET / get_child_List 获取指定大类下的小类列表
// brandId (required) 品牌编号	query	string
// parentCatCode 父类目编号	form	string
export const getChildList = baseService.get_child_List('get');
// GET / get_tree 获取品牌类目树
// catIds 类目id集合，JSON格式	query	string
export const getTree = baseService.get_tree('get');
// POST / delete_custom_cat 删除品牌类目
// catId 类目id	form	number
export const deleteCustomCat = baseService.delete_custom_cat('post');
// GET / get_custom_cat 获取品牌类目
// catId 类目id	form	number
export const getCustomCat = baseService.get_custom_cat('get');
// POST / move_sort 品牌类目移动
// catId 类目id	form	number
// parentCatId 父类目id编号	form	number
// moveType (required) 移动类型，move_up上移，move_down下移，move_top置顶，move_bottom置底	form	string
export const moveSort = baseService.move_sort('post');
// POST / mapping_sys_cat 类目映射
// mappingContent (required)映射关系，以逗号分隔，格式如k: v, k:v（k为品牌类目id，v为平台类目id）	form	string
export const mappingSysCat = baseService['mapping_sys_cat']('post')




