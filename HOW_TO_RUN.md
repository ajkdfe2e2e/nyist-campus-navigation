# 南阳理工学院校园导航系统 - 运行指南

## 本地运行指南

按照以下步骤在本地运行南阳理工学院校园导航系统：

### 方法一：使用本地Web服务器

1. **安装本地Web服务器**
   - 如果你使用Visual Studio Code，可以安装"Live Server"扩展
   - 或者使用Node.js的http-server，Python的SimpleHTTPServer等工具

2. **使用Visual Studio Code + Live Server**
   - 安装VS Code和Live Server扩展
   - 打开项目文件夹
   - 右键点击index.html，选择"Open with Live Server"

3. **使用Python启动简易HTTP服务器**
   ```bash
   # Python 3
   cd 项目目录
   python -m http.server 8080

   # Python 2
   cd 项目目录
   python -m SimpleHTTPServer 8080
   ```
   然后在浏览器中访问: http://localhost:8080

4. **使用Node.js的http-server**
   ```bash
   # 安装http-server
   npm install -g http-server

   # 启动服务器
   cd 项目目录
   http-server -p 8080
   ```
   然后在浏览器中访问: http://localhost:8080

### 方法二：直接在浏览器中打开

你也可以直接在浏览器中打开index.html文件，但可能会受到某些浏览器的安全限制，特别是在加载JavaScript模块时。

## 部署到Web服务器

如果你想将项目部署到Web服务器上，只需将所有文件上传到服务器的Web根目录即可。

## 项目文件说明

项目包含以下主要文件：

- **index.html** - 主页面
- **styles.css** - 样式表
- **campusData.js** - 校园数据
- **pathFinding.js** - 路径查找算法
- **mapView.js** - 地图可视化组件
- **script.js** - 主脚本文件
- **logo.png** - 学校logo（需要自行添加）

## 注意事项

- 如果logo.png文件不存在，可能会导致页面显示错误。请确保添加一个学校logo图片，或修改index.html中的logo引用
- 项目使用了Bootstrap框架，需要互联网连接才能加载CDN资源
- 如有任何问题，请参考README.md文件或联系开发者 