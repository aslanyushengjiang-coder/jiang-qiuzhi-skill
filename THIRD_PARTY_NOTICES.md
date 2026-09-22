# 依赖与分发说明

本包不包含原版vendor/Kami、浏览器二进制、字体文件或用户运行数据。用户指定归档的实战原文和示例保留其中演示资料。
Python基础工具在本次交付中重新实现，不是原版jobctl.py的直接替换。
PDF路线可选依赖Playwright与pypdf，需按各自上游许可和安装要求使用。
品牌/技术标识替换不意味着获得任何未确认的第三方素材权利。
公开分发前确认自有内容的发布许可；本包不替用户自动发布到技能市场或仓库。

## web-access 2.5.4

来源：https://github.com/eze-is/web-access ，作者：一泽Eze。上游 Skill 元数据声明 license: MIT；本次核查上游根目录没有独立 LICENSE 文件，因此保留原始作者、GitHub 和许可声明，不自造版权文本。

`vendor/web-access` 中脚本、模板、API/迁移参考取自用户已安装版本；SKILL.md 使用用户指定原文副本。三份指定文档与腾讯示例完整保留，原件中所述数据和实测结论由原件提供。本包没有复制原机 config.env、Cookie、浏览器资料或 API Key。

## 简历脱敏原文与改写示例（2026-09-22）

`references/golden-resumes` 包含两份公开案例的身份脱敏副本，保留原业务内容，并另存基于原事实的改写示例。姓名、联系方式、头像及个人账号从参考正文/PDF移除，公开出处在此保留以便归属和追溯；不声称原作由本项目创作。

- 产品策划与增长原件：https://github.com/linzhk/chinese-latex-resume 。上游未提供独立 LICENSE；本项目不为原件附加或宣称新的许可，也不将本仓库 LICENSE 扩展至该原件。
- 后端开发模板原件：https://github.com/fky2015/resume-ng 。上游许可 LPPL-1.3c；许可原文另附 `references/golden-resumes/SOURCE-LICENSE-resume-ng.txt`。原版布局由上游制作，本项目仅脱敏身份信息；改写示例使用不同文件名单独保存。

案例经历与数字来自原文，未独立核验；不能将他人履历改为用户本人的经历，也不宣称官方推荐或录用效果。参考资料以来源许可为准，分发本包不改变第三方权利。
