/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  // Tailwind CSS v4 推荐通过 CSS @plugin 使用插件
  // 这里的 plugins 数组主要用于 v3 兼容，但如果你的 css 中已添加 @plugin "tailwindcss-animate"; 可以保留为空
  plugins: [],
}