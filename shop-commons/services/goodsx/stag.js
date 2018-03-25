import { createWebService } from '../base';

//account/bank
const baseService = createWebService('goodsx/stag');
// POST / get_list 标签查询
// tagName 标签名称 String
// tagType 标签类型 0 - 公用,1 - 私用 String
// pageNum 当前页数	Integer
// pageSize 每页显示条数	Integer
export const getTagList = baseService.get_list('post');

// POST / add_tag 新增标签
// tagName 标签名称 String
// tagType 标签类型 0 - 公用,1 - 私用 String
export const addTag = baseService.add_tag('post');

// POST / edit_tag 编辑标签
// tagId(required) 标签id	Long
// tagName 标签名称 String
// tagType 标签类型 0 - 公用,1 - 私用 String
export const editTag = baseService.edit_tag('post');
// POST / delete_tags 删除标签
// tagId(required) 标签id	Long
export const deleteTags = baseService.delete_tags('post');
// POST / addup_spu_tags 批量打标
// tagId(required) 标签id	Long
// queryContent
// tags
export const addupSpuTags = baseService.addup_spu_tags('post');
// POST / delete_spu_tags 批量删除商品标签
//queryContent
export const deleteSpuTags = baseService.delete_spu_tags('post');

// POST / delete_spu_tag 删除指定商品的指定标签
// brandSpuId(required) 商品spuid	Long
// tagId(required) 标签id	Long
export const deleteSpuTag = baseService.delete_spu_tag('post');
// POST /get_all_tags 根据标签类型分组显示标签
// tagName 标签名称 String
// tagType 标签类型 0 - 公用,1 - 私用 String
export const getAllTags = baseService.get_all_tags('post');
// POST / get_spu_tags 商品spu查询
export const getSpuTags = baseService.get_spu_tags('post')
