# 企业语义：Enterprise L3 Profile v2

L3是企业事实层，不只是姓名列表。目标契约包括employee identity、alias、department、job title、grade/track、manager、active/inactive、employment type、explicit authority binding、delegation、policy source/version、temporal validity和scope。

Identity ≠ JobTitle ≠ Grade ≠ Authority。

Authority(e,a,s,t)仅由在该主体、动作、作用域和时刻适用的显式绑定或有效委派支持。岗位、职级、经理关系、外包身份均不能自动推出审批权。

研究企业为星衡智能科技有限公司 / Acme AI Systems Ltd.，包com.acme-ai.enterprise@1.0.0。24名员工、10条权限绑定、4条委派、10条策略。摘要：

`9de990a5a197ba1abba79d1a7251e8be91c7aa479e31f75cf24fcb58e5aa8b17`

Core Gold不依赖L3；L3 Gold固定企业版本与求值时刻。身份停用、权限撤销、委派过期或策略变化必须参与准入重新核验。

本页定义目标，Profile v2实现及正式符合性仍待完成。真实客户L3不属于当前虚拟研究数据，使用或外发须另行明确授权。
