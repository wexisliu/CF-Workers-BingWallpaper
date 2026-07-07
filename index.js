export default {
  async fetch(request) {
    // 获取 Bing 壁纸 JSON 数据
    const res = await fetch('https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1');
    const data = await res.json();

    // 构造图片地址
    const imageBase = data.images[0].urlbase;
    const imageUrl = `https://www.bing.com${imageBase}_1920x1080.jpg`;

    // 返回 302 重定向到原图
    return Response.redirect(imageUrl, 302);
  }
}
