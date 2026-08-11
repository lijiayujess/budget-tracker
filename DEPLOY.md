# 记账本部署指南

## 一、Supabase 项目配置

1. 访问 [Supabase](https://supabase.com/) 并创建新项目。
2. 进入项目后，点击左侧 **SQL Editor** → **New query**。
3. 将 `supabase/migrations/001_create_transactions.sql` 中的全部 SQL 粘贴执行，完成数据表与 RLS 策略创建。
4. 点击左侧 **Authentication** → **Settings**，在 **Email** 中确保已启用邮箱认证（默认开启）。
5. 进入 **Project Settings** → **API**，复制：
   - `URL` → 填入 `.env` 的 `VITE_SUPABASE_URL`
   - `anon public` API Key → 填入 `.env` 的 `VITE_SUPABASE_ANON_KEY`

## 二、本地运行

```bash
# 1. 进入项目目录
cd bookkeeping-app

# 2. 安装依赖
npm install

# 3. 复制环境变量并填写真实值
cp .env.example .env
# 编辑 .env 填入 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY

# 4. 启动开发服务器
npm run dev
```

## 三、部署到 Vercel

### 方式 A：通过 Vercel CLI

```bash
# 1. 全局安装 Vercel CLI
npm i -g vercel

# 2. 登录 Vercel
vercel login

# 3. 在项目根目录执行（按提示选择项目）
vercel

# 4. 配置环境变量
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY

# 5. 重新部署
vercel --prod
```

### 方式 B：通过 Git 仓库导入

1. 将项目提交到 GitHub / GitLab / Bitbucket。
2. 登录 [Vercel Dashboard](https://vercel.com/dashboard)，点击 **Add New...** → **Project**。
3. 导入刚才提交的仓库。
4. 在 **Environment Variables** 中添加：
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. 点击 **Deploy**。

## 四、注意事项

- `VITE_` 前缀的环境变量会在构建时被打包到前端，仅用于公开可访问的 `anon key`，请勿写入 `service_role` 密钥。
- Supabase 默认邮箱验证开启，注册后需点击邮件中的验证链接。如需关闭验证，可在 Authentication → Providers → Email 中关闭 **Confirm email**。
- 若部署后刷新页面 404，请在 Vercel 项目设置中添加重写规则：`/*` → `/index.html`。
