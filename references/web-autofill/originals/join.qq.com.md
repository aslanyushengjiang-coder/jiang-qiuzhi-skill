---
domain: join.qq.com
aliases: [腾讯校招, 腾讯校园招聘, QQ招聘, 腾讯招聘]
updated: 2026-09-22
---

## 平台特征

- **技术栈：Vue3 + Element Plus**（2026-09-21 实测，目标页 `/resumeedit.html`）。所有表单控件都是 Element Plus 组件，这决定了填写方式。
- 简历编辑页需登录（用户浏览器通常已有登录态）。页面顶部会显示「你好，XXX」。
- URL 结构：`https://join.qq.com/resumeedit.html?postid=<岗位ID>&subDirectionId=`，`postid` 是岗位标识，必须在 URL 中保留。
- **简历附件上传后会自动解析并填充表单**（2026-09-21 实测约 8–13 秒完成），页面提示"解析简历内容已填写到下方表单，如有问题，可补充和编辑修改"。解析实测填入约 22 项，并会**自动新增经历块**（如第二个项目块）。
- 表单字段区块用 `<div class="subtitle">` 作为标签，共 50+ 个区块。注意 **`.subtitle` 不在 `.input_box` 内部**。

## 有效模式

### 字段定位（推荐）
按 `.subtitle` 文本定位字段容器，不要用控件序号（自动解析后序号会漂移）：
```js
function boxOf(labelPrefix, nth) {
  var hits = [];
  document.querySelectorAll('.subtitle').forEach(function (s) {
    var t = s.innerText.replace(/\s+/g, '');
    if (t.indexOf(labelPrefix) !== 0) return;
    var p = s.parentElement;
    for (var k = 0; k < 4 && p; k++) {
      if (p.querySelectorAll('input,textarea').length > 0) break;
      p = p.parentElement;
    }
    if (p) hits.push(p);
  });
  return hits[nth || 0] || null;
}
```

### 文本框（el-input）
**必须用 execCommand**，不能用 `el.value = x`：
```js
el.focus();
var again = document.querySelector('input[placeholder="请输入姓名"]');
if (again) again.focus();
document.execCommand('selectAll', false, null);
document.execCommand('insertText', false, '值');
```
textarea 同理。

### 单选（el-radio）
```js
document.querySelectorAll('label.el-radio').forEach(function (l) {
  if (l.innerText.trim() === '男') l.click();
});
```
回读：选中的 label 带 `is-checked` 类。

### 下拉（el-select）
三类鼠标事件都要派发，等 ≥650ms 再选：
```js
['mousedown', 'mouseup', 'click'].forEach(function (ev) {
  inp.dispatchEvent(new MouseEvent(ev, { bubbles: true }));
  wrap.dispatchEvent(new MouseEvent(ev, { bubbles: true }));   // .el-input__wrapper
  box.dispatchEvent(new MouseEvent(ev, { bubbles: true }));    // .el-select
});
// 等 650ms，然后在可见的 .el-select-dropdown 里找 .el-select-dropdown__item 点击
```

### 级联（el-cascader）
点 input 打开 → 逐级点 `.el-cascader-menu[n]` 内的 `.el-cascader-node`（按 `innerText` 精确匹配），每级间隔 ≥600ms。节点需先派发 `mousedown`/`mouseup` 再 `click()`。
层级示例：`中国大陆 → 上海 → 上海市`（直辖市第三级只有自身一个节点）。

### 日期（el-date-editor）
input 非 readonly，可直接赋值 + 派发 input/change/Enter/blur。

### 文件上传
```bash
curl -X POST "http://localhost:3456/setFiles?target=ID" \
  -d '{"selector":"input[type=file]","files":["/绝对路径/xx.pdf"]}'
```
页面共 4 个 file 控件，DOM 顺序：**0=简历附件、1=更新、2=个人照片(.jpg,.png)、3=作品集**。`input[type=file]` 命中第 0 个即简历附件。

## 已知陷阱

- 🔴 **文本框用 DOM 赋值会被回滚**（2026-09-21）：`el.value = x` + 派发 input 事件后，DOM 能读到值，但组件重渲染时被清空。实测连填 16 个文本框后做几轮下拉交互，全部丢失。必须用 `execCommand('insertText')`。
- 🔴 **不要用"最后一个可见下拉面板"做兜底**（2026-09-21）：所有 el-select 的 dropdown 都预渲染在 DOM 中，只有打开的那个 `offsetParent !== null`。兜底会误取**手机号区号下拉**（选项为"中国 +86 / 中国香港 +852…"），而「国家/地区」下拉的选项是"中国 / 中国香港 / 中国澳门 / 中国台湾 / 美国…"。
- 🔴 **不要用控件序号定位**（2026-09-21）：上传简历触发自动解析后会新增经历块，同一字段的 input 索引偏移 +1~+6。
- 🟡 **字段容器不是 `.input_box`**：`.subtitle` 的 `closest('.input_box')` 返回 `null`，要从 subtitle 向上找第一个含控件的祖先。
- 🟡 **日期 placeholder 不止一种**：「选择日期」（教育/实习/项目起止）和「请选择获奖时间」（获奖时间，回读只显示到年）。
- 🟡 **「导师 / 实验室 / 研究方向」在"学历=本科"时是隐藏字段**：`offsetParent === null`、宽高 0×0，focus 与 execCommand 均无效。这是页面行为，不是填写失败。
- 🟡 **「个人证件」类型锁定**：选完「国家/地区 = 中国」后自动带出「中国-居民身份证」，元素带 `isDisabled` + `aria-disabled="true"`，只需填号码。
- 🟡 **「紧急联系人」与「紧急联系人电话」前缀重叠**：`boxOf('紧急联系人')` 会先命中"紧急联系人"（姓名）。区分办法：电话用更长前缀 `紧急联系人电`，并在队列里**先填电话、后填姓名**。
- ⚪ **选项受限的字段**（2026-09-21）：
  - 期望工作城市只有 `深圳总部 / 北京 / 上海 / 广州`（无杭州，多选至多 3 个）
  - 感兴趣的事业群只有 `无明确意向 / CDG / IEG / WXG / CSIG`
  - 感兴趣的部门在选完事业群后下拉为空
  - 参加面试城市只有 `远程面试`
  - 学历只有 `本科 / 硕士研究生 / 博士研究生 / 高中 / 大专`
  - 成绩排名只有 `前5% / 前10% / 前20% / 其他`
  - 获奖类型只有 `奖学金 / 竞赛获奖 / 其他`
- ⚪ **操作前的合规边界**：证件号码、隐私政策勾选、最终提交必须由用户本人完成。
