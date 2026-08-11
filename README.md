# 记账本

基于 Vite + Vue 3 + TailwindCSS 的响应式记账网页，使用 Supabase 实现多人账号系统与云端数据同步。

## 功能特性

- 邮箱注册、登录、退出、重置密码
- 账单增删改查，支持收入/支出切换
- 支出分类饼图、月度收支趋势图
- 浅色/深色模式切换
- PC 侧边导航 + 移动端底部导航
- 数据通过 Supabase 云端同步，跨设备自动同步
- RLS 行级权限隔离，用户仅可访问自己的账单

## 快速开始

```bash
npm install
cp .env.example .env
# 编辑 .env 填入 Supabase 配置
npm run dev
```

## 部署

详见 [DEPLOY.md](./DEPLOY.md)。
