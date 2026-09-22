# Jiang-qiuzhi-skill

生姜求职助手｜1.0.0-rc.5｜WorkBuddy 优先，其他 Agent 需核查实际工具能力。

把求职的六件事放进同一套工作流：找岗位、筛秋招表、定制简历、网申代填、跟踪进度、面试陪练。
这是可读取并可导入的候选发布包，不是已在所有电脑和招聘网站完成验证的产品。

## 安装

在 WorkBuddy 的技能页面使用“添加技能／导入本地技能包”，选择下载的 ZIP，
或按当前客户端支持的流程导入解压后的 `jiang-qiuzhi-skill` 文件夹。
若导入失败，先解压到新的求职工作区，让 WorkBuddy 读取其中的 `SKILL.md` 执行；
这只是会话内读取，不应被描述为已成功安装。

品牌名称是 **Jiang-qiuzhi-skill**；技术标识与安装目录统一为小写 `jiang-qiuzhi-skill`。
安装后在“已安装”中核对名称；让 WorkBuddy 复述六个模块、提交边界，并用虚构资料运行一次。
本包不提供虚构 GitHub 地址，也不要求执行远程 curl/npx 安装命令。

可复制 [安装提示词](prompts/安装提示词.txt)。第一次使用直接说：

> 使用 Jiang-qiuzhi-skill。这是我的简历。我是2027届，想在杭州找数据分析正式岗。
> 请先复用简历里的信息，只补问影响选岗的缺项；先广泛找机会，不要只找三家公司。

## 本包有什么

`references/` 是分模块执行规则；`scripts/` 是本地数据处理、状态记录和简历导出工具；
`assets/` 是简历样式、JSON/CSV与工作簿模板；`prompts/` 是可复制提示词；
`demo/` 是明确标注的虚构演示资料；`tests/` 是自动测试和真人验收清单。
不需要再下载其他求职 Skill。本包没有打包 Kami；现已内置 web-access 运行文件、三份网申原文与腾讯示例，详见 [网申接入](references/web-autofill/接入与复用.md)。

## 能力依赖

本地表格导入（CSV/TSV/XLSX）、去重、初筛、SQLite记录和测试使用 Python 3.9+ 标准库。
PDF 路线需要已可用 Chromium 系浏览器，以及 `playwright`、`pypdf`；详见导出说明。
联网找岗与真实网页代填由宿主已授权工具执行，本包不是独立联网爬虫，也没有通用网申网站适配器。
缺能力时给出具体降级结果，不会自行安装软件、申请付费服务或降低安全设置。

## 使用前知道

只改真实经历；提交前自己检查。学习和模拟不等于考试中违规代答。
演示岗位和简历全是虚构数据，不可投递。本包不包含宣传文案所说的真实5000条岗位表。
导入自己的表后可以程序化处理全量记录，但每个拟投岗位仍需回官网核实。
所有运行数据放在独立工作区，不放进分发目录。

官方安装方式核对日期：2026-09-17。
来源：https://www.workbuddy.cn/docs/workbuddy/From-Beginner-to-Expert-Guide/Function-Description/Skills-Market
格式参考：https://www.codebuddy.ai/docs/ide/Features/Skills

## 2026-09-22 网申原文整合

三份用户指定原文按字节保留，web-access 2.5.4 所需脚本随包携带。安装后可由 WorkBuddy 当前模型调用，无需另接 Midscene。先读取网申接入说明，使用本人资料、岗位与简历；原文的演示数据、路径和历史成功数不代表新用户已经完成实测。

## 交付状态（历史记录）

先读 [本次验收结果](tests/本次验收结果.md) 与 [本地落地说明](本地落地说明.md)。53项本地测试通过，但新版WorkBuddy安装与真实网申整链未验收；PDF在当前root测试容器中默认沙箱路线失败，受控渲染验证单列。不要将本包标为全平台生产验证版。

## 黄金简历参考

[两份脱敏原文与修改后示例](references/golden-resumes/使用规则.md)：产品策划与增长、后端开发与技术项目表达。原文只隐去身份信息，具体业务、动作和数据逐字保留；改写内容单独存放。博士科研案例已移除。用户最终简历仍须用本人事实填写并验收一页 A4。

最新安装包：[下载](https://github.com/aslanyushengjiang-coder/jiang-qiuzhi-skill/releases/latest/download/jiang-qiuzhi-skill.zip)。
