import { createWebService } from '../../base';

//account/bank
const baseService = createWebService('brand/knowledge');

/**
 * 获取知识库类目列表
 * brandId:
 */
export const getKnowledgeCatList = baseService.get_konwledge_cat_list('get');

/**
 * 增加知识库类目
 * brandId:
 * name
 */
export const addKnowledgeCat = baseService.add_konwledge_cat('post');

/**
 * 修改知识库类目
 * brandId:
 * knowledgeCatId:
 * name:
 */
export const modifyKnowledgeCat = baseService.modify_konwledge_cat('post');

/**
 * 删除知识库类目
 * brandId:
 * knowledgeCatId:
 */
export const removeKnowledgeCat = baseService.remove_konwledge_cat('post');

/**
 * 查询知识列表
 * brandId:
 * knowledgeStatus:知识发布状态 0:未发布 1:已发布   
 * knowledgeTitle:知识标题
 * catId:知识类目Id
 * showCount:每页显示多少条
 * currentPage:当前页
 */
export const getKnowledgeList = baseService.get_konwledge_list('get');

/**
 * 查询知识详情
 * brandId:
 * knowledgeId:知识id
 */
export const getKnowledgeDetail = baseService.get_konwledge_detail('get');

/**
 * 删除知识
 * brandId:
 * knowledgeId:知识id
 */
export const removeKnowledge = baseService.remove_konwledge('post');

/**
 * 修改知识
 * brandId:
 * brandKnowledgeAtom:知识原子
 */
export const modifyKnowledge = baseService.modify_konwledge('post');

/**
 * 保存知识
 * brandId:
 * brandKnowledgeAtom:知识原子
 */
export const saveKnowledge = baseService.save_konwledge('post');

/**
 * 发布知识
 * brandId:
 * knowledgeId:知识id
 */
export const publishKnowledge = baseService.publish_konwledge('post');

/**
 * 撤销知识
 * brandId:
 * knowledgeId:知识id
 */
export const revocationKnowledge = baseService.revocation_konwledge('post');

/**
 * 保存并发布知识
 * brandId:
 * brandKnowledgeAtom:知识原子
 * brandKnowledgeAdjunctAtom:知识附件原子
 */
export const savePublishKnowledge = baseService.save_publish_konwledge('post');

/**
 * 获取知识学习记录
 * brandId:
 * knowledgeId:知识Id
 * provinceCode:
 * cityCode:
 * storageName:门店名称
 * staffName:导购名称
 * showCount:
 * currentPage:
 */
export const getKnowledgeBrowseList = baseService.get_konwledge_browse_list('get');
/**
 * 获取知识回复列表
 * brandId:
 * knowledgeId:知识Id
 * provinceCode:
 * cityCode:
 * storageName:门店名称
 * staffName:导购名称
 * showCount:
 * currentPage:
 */
export const getKnowledgeReplyList = baseService.get_konwledge_reply_list('get');
/**
 *删除回复
 * brandId
 * replyId
 * knowledgeId
 */
export const removeKnowledgeReply = baseService.remove_konwledge_reply('post');


export default {
    getKnowledgeCatList,
    addKnowledgeCat,
    modifyKnowledgeCat,
    removeKnowledgeCat,
    getKnowledgeList,
    getKnowledgeDetail,
    removeKnowledge,
    modifyKnowledge,
    saveKnowledge,
    publishKnowledge,
    revocationKnowledge,
    savePublishKnowledge,
    getKnowledgeBrowseList,
    getKnowledgeReplyList,
    removeKnowledgeReply
}