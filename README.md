# CF-Workers-BingWallpaper

`CF-Workers-Bing-Wallpaper` 是一个基于 Cloudflare Workers 搭建的**极简、优雅的 Bing 每日壁纸 API**。

本项目通过极其精简的代码，利用 **302 重定向** 机制，让边缘节点充当“指路人”，将用户的图片请求瞬间引导至微软 Bing 官方的高清 CDN 地址。非常适合用作个人博客动态背景、Web 项目头图或各类桌面/手机壁纸轮播源。

---

## ✨ 核心特性

* ⚡ **极简优雅**：不到 20 行代码，无任何复杂依赖，完美体现 Serverless 架构的轻量与高效。
* 📉 **零流量开销**：采用 302 临时重定向，Worker 不下载、不中转图片流，几乎不消耗任何 Workers 额度。
* 🚀 **极速加载**：直接“白嫖”微软全球官方 CDN，图片加载速度取决于 Bing 官方边缘节点，稳定且高速。
* 🖼️ **原生高清**：自动提取 `urlbase` 并拼接 `_1920x1080.jpg` 后缀，确保输出无水印的 1080P 桌面级高清原图。

---

## 🛠️ 部署步骤

### 1. 创建 Worker

登录 Cloudflare Dashboard，前往 **Workers & Pages** -> **Create Application** -> **Create Worker**。

### 2. 配置代码

将项目中的 `index.js`（或下方代码）直接复制到 Worker 编辑器中并保存部署：

```javascript
export default {
  async fetch(request) {
    // 1. 获取 Bing 壁纸 JSON 数据 (idx=0 表示当天)
    const res = await fetch('https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1');
    const data = await res.json();
    
    // 2. 构造 1080P 高清图片地址
    const imageBase = data.images[0].urlbase;
    const imageUrl = `https://www.bing.com${imageBase}_1920x1080.jpg`;
    
    // 3. 返回 302 重定向到 Bing 官方原图 CDN
    return Response.redirect(imageUrl, 302);
  }
}

```

### 3. 使用方法

部署完成后，Cloudflare 会为你分配一个 `*.workers.dev` 的默认域名（你也可以绑定自己的自定义域名）。

* **直接访问**：在浏览器中打开该链接，页面会自动跳转到今天的 Bing 高清壁纸。
* **网页引用**：直接将该 API 链接填入 HTML 或 CSS 中即可完美充当动态背景：
```html
<img src="https://你的Worker域名.workers.dev" alt="Bing Daily Wallpaper">

```


```css
body {
  background-image: url('https://你的Worker域名.workers.dev');
}

```



---

## 📝 运行原理

```text
[ 用户请求 ] ───> [ Cloudflare Worker ]
                         │
                         ├──> 1. 请求 Bing 接口获取今日壁纸元数据
                         ├──> 2. 拼接出高清大图 URL
                         └─<─ 3. 返回 302 Found (重定向至 Bing CDN)
                                 │
[ 浏览器/应用 ] <────────────────┘ (瞬间跳转，直接从微软 CDN 加载图片)

```

---

## 📄 开源协议

本项目基于 [MIT License](https://www.google.com/search?q=LICENSE) 协议开源。
