/* ============================================================
 * 腾讯校招网申 · 补齐脚本 v3（秋招录屏演示用）
 * 目标页：https://join.qq.com/resumeedit.html?postid=1282707375417304064
 * 岗位：市场营销 / 市场 / 应届毕业生
 *
 * 【推荐录制流程】
 *   ① Agent 用 CDP 上传简历 03-营销策划-余生姜-演示.pdf
 *      → 腾讯自动解析并填入 22 项（含自动新增第二个项目块）
 *   ② 解析完成后执行本脚本，补齐解析没填到的字段
 *   页面若已有值，本脚本会覆盖为配置值（保证与答案清单一致）
 *
 * 【定位方式】
 *   不依赖控件序号。按 .subtitle 标签文本找字段区块，
 *   再在区块内取控件。自动解析新增经历块也不会错位。
 *
 * 【标 ★ 的是演示假值】
 *   手机号 / QQ号 / 紧急联系人 / 外语分数 / 证明人
 *
 * 【不包含】证件号码、简历附件、个人照片、作品集附件、
 *           隐私政策勾选、最终提交
 * ============================================================ */

(function () {
  'use strict';

  var STEP_MS = 700;
  var LOG = [];
  window.__fillLog = LOG;

  var CFG = {
    name: '余生姜',
    gender: '男',
    country: '中国',
    mobile: '13800000000',           // ★ 演示假号
    email: 'shengjiang.demo@example.invalid',
    currentCity: ['中国大陆', '上海', '上海市'],
    wechat: 'shengjiang_demo_only',
    qq: '123456789',                 // ★ 演示假号
    emergencyName: '余江海',          // ★ 演示
    emergencyPhone: '13800000001',   // ★ 演示假号

    expectCity: '上海',
    acceptOtherCity: '是',
    businessGroup: '无明确意向',
    department: '无明确意向',
    interviewCity: '远程面试',

    degree: '本科',
    school: '上海对外经贸大学',
    schoolCity: ['中国大陆', '上海', '上海市'],
    eduStart: '2023-09-01',
    eduEnd: '2027-06-30',
    college: '统计与信息学院',
    major: '应用统计学',
    rank: '前20%',
    gpa: '3.65',
    gpaBase: '4.00',

    internCompany: '同尘增长教育科技',
    internTitle: '数据分析实习生（模拟）',
    internStart: '2026-06-01',
    internEnd: '2026-08-31',
    internDesc:
      '营销数据支持：在导师指导下整理3个渠道订单，核对重复和退款记录，协助准备渠道销售表现数据。\n' +
      '报表与核对：处理12480条订单并交付8期周报；发现退款订单统计口径问题，提交明细，经导师确认后修正。',

    projName: '课程与实战营发售',
    projRole: '项目总操盘手',
    projStart: '2026-02-01',
    projEnd: '2026-03-31',
    projDesc:
      '活动目标与责任：围绕课程与实战营发售，担任项目总操盘手，负责筹备、招商裂变、社群运营、销售转化与收尾全流程。\n' +
      '策划落地：安排各阶段工作与执行节奏，组织朋友圈、私戳和社群触达，推进从获客到成交的各环节；实战营中同时承担主讲。\n' +
      '成果交付：实战营获客3000人，3天成交20万元；大学规划课程获客9420人，成交40万元，均为项目整体成果。\n' +
      '资产沉淀：整理推广话术、合作SOP和社群运营流程，形成下一场活动可复用的执行资料。',

    awardType: '奖学金',
    awardName: '校级二等奖学金',
    awardDate: '2025-11-01',
    awardDesc: '2025年11月获校级二等奖学金，学业成绩排名前20%（演示）。',

    aiTools: 'WorkBuddy（Agent/Skill 工作流）、Codex（代码与批处理）、飞书（多维表格与文档协作）',
    aiProject:
      '目标背景：面向重复性工作密集的职业，围绕真实工作任务制作 AI 实操教程。\n' +
      '工具选择与原因：用 WorkBuddy 封装 Agent/Skill 工作流，Codex 处理脚本与批处理，飞书组织素材与协作，覆盖从调研到成稿的完整链路。\n' +
      '分工：我负责场景拆解、脚本设计与演示录制，AI 负责初稿生成、数据处理与素材整理。\n' +
      '核心挑战与解决：不同职业的任务差异大，重复动作难以复用；通过把流程抽象成 Skill 模板，再按职业调整参数解决。\n' +
      '项目结果：完成系列内容制作并运营账号，单月流量 100 万、涨粉 1 万。',

    foreignScore: '545',             // ★ CET-6 演示分
    devLang: 'Python',
    referee: '张明',                  // ★ 演示
    refereeTitle: '直属主管',          // ★ 演示
    refereePhone: '13800000002',     // ★ 演示假号

    otherInfo:
      '自我评价：统计学背景，能使用 SQL、Excel、Python 完成数据整理与分析；有完整的营销活动操盘经验，从策划、获客到成交全流程推进。\n' +
      '爱好特长：关注 AI 工具在工作场景的落地，长期制作 AI 实操内容并运营账号。'
  };

  /* ---------------- 标签定位 ---------------- */
  // 字段容器 = 距离 .subtitle 最近、且内部含控件的祖先元素
  // 注意：容器不是 .input_box，subtitle 并不在 .input_box 里面
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

  function scrollTo(el) {
    try { el.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (e) {}
  }

  function textInput(b) {
    return b ? b.querySelector('input.el-input__inner:not([readonly])') : null;
  }

  function dateInputs(b) {
    return b ? b.querySelectorAll('input.el-input__inner[placeholder*="日期"], input.el-input__inner[placeholder*="获奖时间"]') : [];
  }

  /* ---------------- 操作 ---------------- */
  function typeIn(b, val, label) {
    if (!val) { LOG.push('– 留空：' + label); return; }
    var el = textInput(b);
    if (!el) { LOG.push('✗ 无输入框：' + label); return; }
    scrollTo(el);
    el.focus();
    var again = textInput(b);
    if (again) again.focus();
    document.execCommand('selectAll', false, null);
    document.execCommand('insertText', false, val);
    var back = textInput(b);
    LOG.push('✓ ' + label + ' = ' + String((back && back.value) || '').slice(0, 26));
  }

  function typeAreaIn(b, val, label) {
    var el = b ? b.querySelector('textarea') : null;
    if (!el) { LOG.push('✗ 无文本域：' + label); return; }
    scrollTo(el);
    el.focus();
    document.execCommand('selectAll', false, null);
    document.execCommand('insertText', false, val);
    LOG.push('✓ ' + label + ' 已填 ' + el.value.length + ' 字');
  }

  function openSelectIn(b) {
    if (!b) return;
    var box = b.querySelector('.el-select');
    if (!box) { LOG.push('✗ 无下拉控件'); return; }
    scrollTo(box);
    var inp = box.querySelector('input');
    var wrap = box.querySelector('.el-input__wrapper') || box;
    ['mousedown', 'mouseup', 'click'].forEach(function (ev) {
      inp.dispatchEvent(new MouseEvent(ev, { bubbles: true }));
      wrap.dispatchEvent(new MouseEvent(ev, { bubbles: true }));
      box.dispatchEvent(new MouseEvent(ev, { bubbles: true }));
    });
  }

  function visibleDropdown() {
    var dd = null;
    document.querySelectorAll('.el-select-dropdown').forEach(function (d) {
      if (d.offsetParent !== null && d.querySelectorAll('.el-select-dropdown__item').length) dd = d;
    });
    return dd;
  }

  function pickOption(match, label) {
    var dd = visibleDropdown();
    if (!dd) { LOG.push('✗ 面板未出现：' + label); return; }
    var items = dd.querySelectorAll('.el-select-dropdown__item');
    for (var i = 0; i < items.length; i++) {
      var t = items[i].innerText.trim();
      if (match(t)) { items[i].click(); LOG.push('✓ ' + label + ' = ' + t); return; }
    }
    LOG.push('✗ 选项未匹配：' + label);
  }

  function openCascaderIn(b) {
    var el = b ? b.querySelector('input.el-input__inner') : null;
    if (!el) { LOG.push('✗ 无级联控件'); return; }
    scrollTo(el);
    ['mousedown', 'mouseup', 'click'].forEach(function (ev) {
      el.dispatchEvent(new MouseEvent(ev, { bubbles: true }));
    });
    el.click();
  }

  function cascaderStep(menuIndex, label) {
    var p = null;
    document.querySelectorAll('.el-cascader-panel').forEach(function (x) {
      if (x.offsetParent !== null) p = x;
    });
    if (!p) { LOG.push('✗ 级联面板未出现（' + label + '）'); return; }
    var menus = p.querySelectorAll('.el-cascader-menu');
    if (menus.length <= menuIndex) { LOG.push('✗ ' + label + ' 层级未展开'); return; }
    var nodes = menus[menuIndex].querySelectorAll('.el-cascader-node');
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].innerText.trim() === label) {
        var n = nodes[i];
        ['mousedown', 'mouseup'].forEach(function (ev) {
          n.dispatchEvent(new MouseEvent(ev, { bubbles: true }));
        });
        n.click();
        LOG.push('✓ 级联：' + label);
        return;
      }
    }
    LOG.push('✗ 级联未找到：' + label);
  }

  function pickRadio(label) {
    var hit = false;
    document.querySelectorAll('label.el-radio').forEach(function (l) {
      if (l.innerText.trim() === label) { l.click(); hit = true; }
    });
    LOG.push((hit ? '✓' : '✗') + ' 单选：' + label);
  }

  function setDate(b, idx, val, label) {
    var ds = dateInputs(b);
    var el = ds[idx];
    if (!el) { LOG.push('✗ 日期未找到：' + label + '#' + idx); return; }
    var proto = Object.getPrototypeOf(el);
    var desc = Object.getOwnPropertyDescriptor(proto, 'value');
    desc.set.call(el, val);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true }));
    el.dispatchEvent(new Event('blur', { bubbles: true }));
    LOG.push('✓ ' + label + '#' + idx + ' = ' + el.value);
  }

  /* ---------------- 步骤队列 ---------------- */
  var steps = [];

  // ① 基础信息
  steps.push(function () { typeIn(boxOf('姓名'), CFG.name, '姓名'); });
  steps.push(function () { pickRadio(CFG.gender); });
  steps.push(function () { openSelectIn(boxOf('国家/地区')); });
  steps.push(function () { pickOption(function (t) { return t === CFG.country; }, '国家/地区'); });
  steps.push(function () { LOG.push('– 证件类型已自动带出「中国-居民身份证」（锁定）'); });
  steps.push(function () { typeIn(boxOf('手机号码'), CFG.mobile, '手机号码'); });
  steps.push(function () { typeIn(boxOf('邮箱'), CFG.email, '邮箱'); });
  steps.push(function () { openCascaderIn(boxOf('当前所处地')); });
  steps.push(function () { cascaderStep(0, CFG.currentCity[0]); });
  steps.push(function () { cascaderStep(1, CFG.currentCity[1]); });
  steps.push(function () { cascaderStep(2, CFG.currentCity[2]); });
  steps.push(function () { typeIn(boxOf('微信号'), CFG.wechat, '微信号'); });
  steps.push(function () { typeIn(boxOf('QQ号'), CFG.qq, 'QQ号'); });
  steps.push(function () { typeIn(boxOf('紧急联系人电'), CFG.emergencyPhone, '紧急联系人电话'); });
  steps.push(function () { typeIn(boxOf('紧急联系人'), CFG.emergencyName, '紧急联系人'); });

  // ② 意向信息
  steps.push(function () { openSelectIn(boxOf('期望工作城市')); });
  steps.push(function () { pickOption(function (t) { return t.indexOf(CFG.expectCity) > -1; }, '期望工作城市'); });
  steps.push(function () { pickRadio(CFG.acceptOtherCity); });
  steps.push(function () { openSelectIn(boxOf('感兴趣的事业群')); });
  steps.push(function () { pickOption(function (t) { return t.indexOf(CFG.businessGroup) > -1; }, '事业群'); });
  steps.push(function () { openSelectIn(boxOf('感兴趣的部门')); });
  steps.push(function () { pickOption(function (t) { return t.indexOf(CFG.department) > -1; }, '部门'); });
  steps.push(function () { openSelectIn(boxOf('参加面试城市')); });
  steps.push(function () { pickOption(function (t) { return t.indexOf(CFG.interviewCity) > -1; }, '面试城市'); });

  // ③ 教育经历
  steps.push(function () { openSelectIn(boxOf('学历')); });
  steps.push(function () { pickOption(function (t) { return t === CFG.degree; }, '学历'); });
  steps.push(function () { typeIn(boxOf('学校名称'), CFG.school, '学校名称'); });
  steps.push(function () { openCascaderIn(boxOf('目前就读地')); });
  steps.push(function () { cascaderStep(0, CFG.schoolCity[0]); });
  steps.push(function () { cascaderStep(1, CFG.schoolCity[1]); });
  steps.push(function () { cascaderStep(2, CFG.schoolCity[2]); });
  steps.push(function () { setDate(boxOf('起止时间', 0), 0, CFG.eduStart, '教育起'); });
  steps.push(function () { setDate(boxOf('起止时间', 0), 1, CFG.eduEnd, '教育止'); });
  steps.push(function () { typeIn(boxOf('院系'), CFG.college, '院系'); });
  steps.push(function () { typeIn(boxOf('专业'), CFG.major, '专业'); });
  steps.push(function () { openSelectIn(boxOf('成绩排名')); });
  steps.push(function () { pickOption(function (t) { return t === CFG.rank; }, '成绩排名'); });
  steps.push(function () { typeIn(boxOf('GPA-GPA'), CFG.gpa, 'GPA'); });
  steps.push(function () { typeIn(boxOf('GPA-BASE'), CFG.gpaBase, 'GPA-BASE'); });

  // ④ 实习经历
  steps.push(function () { typeIn(boxOf('公司'), CFG.internCompany, '实习公司'); });
  steps.push(function () { typeIn(boxOf('职位'), CFG.internTitle, '实习职位'); });
  steps.push(function () { setDate(boxOf('起止时间', 1), 0, CFG.internStart, '实习起'); });
  steps.push(function () { setDate(boxOf('起止时间', 1), 1, CFG.internEnd, '实习止'); });
  steps.push(function () { typeAreaIn(boxOf('描述', 0), CFG.internDesc, '实习描述'); });

  // ⑤ 项目经历（第一段）
  steps.push(function () { typeIn(boxOf('项目名称', 0), CFG.projName, '项目名称'); });
  steps.push(function () { typeIn(boxOf('在项目中担任的角色', 0), CFG.projRole, '项目角色'); });
  steps.push(function () { setDate(boxOf('起止时间', 2), 0, CFG.projStart, '项目起'); });
  steps.push(function () { setDate(boxOf('起止时间', 2), 1, CFG.projEnd, '项目止'); });
  steps.push(function () { typeAreaIn(boxOf('描述', 1), CFG.projDesc, '项目描述'); });

  // ⑥ 获奖信息
  steps.push(function () { openSelectIn(boxOf('获奖类型')); });
  steps.push(function () { pickOption(function (t) { return t === CFG.awardType; }, '获奖类型'); });
  steps.push(function () { typeIn(boxOf('奖项名称'), CFG.awardName, '奖项名称'); });
  steps.push(function () { setDate(boxOf('获奖时间'), 0, CFG.awardDate, '获奖时间'); });
  steps.push(function () { typeAreaIn(boxOf('奖项说明'), CFG.awardDesc, '奖项说明'); });

  // ⑦ AI 应用技能
  steps.push(function () { typeAreaIn(boxOf('请列出你常用的AI'), CFG.aiTools, 'AI工具'); });
  steps.push(function () { typeAreaIn(boxOf('请描述一个或多个'), CFG.aiProject, 'AI项目'); });

  // ⑧ 作品与个人主页
  steps.push(function () { typeIn(boxOf('外语考试'), CFG.foreignScore, '外语分数'); });
  steps.push(function () { openSelectIn(boxOf('开发语言')); });
  steps.push(function () { pickOption(function (t) { return t === CFG.devLang; }, '开发语言'); });

  // ⑨ 证明人
  steps.push(function () { typeIn(boxOf('以上资料证明人'), CFG.referee, '证明人'); });
  steps.push(function () { typeIn(boxOf('证明人身份'), CFG.refereeTitle, '证明人身份'); });
  steps.push(function () { typeIn(boxOf('联系电话'), CFG.refereePhone, '证明人电话'); });

  // ⑩ 补充信息
  steps.push(function () { typeAreaIn(boxOf('补充信息'), CFG.otherInfo, '补充信息'); });

  /* ---------------- 串行执行 ---------------- */
  var i = 0;
  function next() {
    if (i >= steps.length) {
      LOG.push('=== 补齐完成，共 ' + steps.length + ' 步 ===');
      LOG.push('未填：证件号码、个人照片、作品集附件、隐私政策、最终提交');
      console.log('%c腾讯网申补齐完成', 'color:#185FA5;font-weight:bold', LOG);
      return;
    }
    try { steps[i](); } catch (e) { LOG.push('✗ 第' + i + '步异常：' + e.message); }
    i++;
    setTimeout(next, STEP_MS);
  }
  next();

  console.log('补齐脚本已启动，共 ' + steps.length + ' 步，约 ' +
    Math.round((steps.length * STEP_MS) / 1000) + ' 秒。进度见 window.__fillLog');
})();
