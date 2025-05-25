/**
 * 南阳理工学院校园导航系统
 * 地图可视化组件
 * 作者：杨博文（2415929683）
 * 完成日期：2025.5.20
 */

// 地图配置
const MAP_CONFIG = {
    width: 1000, // 地图SVG宽度
    height: 800, // 地图SVG高度
    buildingRadius: 15, // 建筑物节点半径
    zoomStep: 0.2, // 缩放步长
    maxZoom: 3, // 最大缩放倍数
    minZoom: 0.5, // 最小缩放倍数
};

// 当前地图状态
const mapState = {
    zoom: 1, // 当前缩放倍数
    pan: { x: 0, y: 0 }, // 平移量
    selectedLocationId: null, // 当前选中的地点ID
    hightlightedPath: [], // 高亮显示的路径
    campusFilter: 'all', // 当前校区筛选
};

/**
 * 初始化地图
 * @param {string} containerId - 地图容器ID
 */
function initMap(containerId = 'campus-map') {
    // 创建SVG元素
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // 清空容器
    container.innerHTML = '';
    
    // 创建SVG元素
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${MAP_CONFIG.width} ${MAP_CONFIG.height}`);
    svg.setAttribute('class', 'campus-map-svg');
    container.appendChild(svg);
    
    // 创建背景层
    const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    background.setAttribute('width', MAP_CONFIG.width);
    background.setAttribute('height', MAP_CONFIG.height);
    background.setAttribute('fill', '#f0f4f8');
    svg.appendChild(background);
    
    // 创建路径层
    const pathLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    pathLayer.setAttribute('id', 'path-layer');
    svg.appendChild(pathLayer);
    
    // 创建建筑物层
    const buildingLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    buildingLayer.setAttribute('id', 'building-layer');
    svg.appendChild(buildingLayer);
    
    // 创建标签层
    const labelLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    labelLayer.setAttribute('id', 'label-layer');
    svg.appendChild(labelLayer);
    
    // 创建高亮路径层
    const highlightLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    highlightLayer.setAttribute('id', 'highlight-layer');
    svg.appendChild(highlightLayer);
    
    // 添加拖动和缩放功能
    addDragAndZoom(svg);
    
    return svg;
}

/**
 * 添加拖动和缩放功能
 * @param {SVGElement} svg - SVG元素
 */
function addDragAndZoom(svg) {
    let isDragging = false;
    let startX, startY;
    
    // 鼠标按下事件处理函数
    const handleMouseDown = (event) => {
        // 只响应主鼠标按钮
        if (event.button !== 0) return;
        
        isDragging = true;
        startX = event.clientX;
        startY = event.clientY;
        
        // 设置光标样式
        svg.style.cursor = 'grabbing';
    };
    
    // 鼠标移动事件处理函数
    const handleMouseMove = (event) => {
        if (!isDragging) return;
        
        // 计算移动距离
        const dx = event.clientX - startX;
        const dy = event.clientY - startY;
        
        // 更新起始位置
        startX = event.clientX;
        startY = event.clientY;
        
        // 更新平移量
        mapState.pan.x += dx / mapState.zoom;
        mapState.pan.y += dy / mapState.zoom;
        
        // 应用变换
        updateTransform();
    };
    
    // 鼠标松开事件处理函数
    const handleMouseUp = () => {
        isDragging = false;
        
        // 恢复光标样式
        svg.style.cursor = 'grab';
    };
    
    // 鼠标滚轮事件处理函数
    const handleWheel = (event) => {
        event.preventDefault();
        
        // 计算新的缩放倍数
        const delta = event.deltaY < 0 ? MAP_CONFIG.zoomStep : -MAP_CONFIG.zoomStep;
        const newZoom = Math.max(MAP_CONFIG.minZoom, Math.min(MAP_CONFIG.maxZoom, mapState.zoom + delta));
        
        // 如果缩放倍数没有变化，直接返回
        if (newZoom === mapState.zoom) return;
        
        // 获取鼠标相对于SVG的位置
        const rect = svg.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        
        // 计算鼠标在地图坐标系中的位置
        const mapX = mouseX / mapState.zoom - mapState.pan.x;
        const mapY = mouseY / mapState.zoom - mapState.pan.y;
        
        // 更新缩放倍数
        mapState.zoom = newZoom;
        
        // 调整平移量，使鼠标指向的点保持不变
        mapState.pan.x = mouseX / mapState.zoom - mapX;
        mapState.pan.y = mouseY / mapState.zoom - mapY;
        
        // 应用变换
        updateTransform();
    };
    
    // 添加事件监听器
    svg.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    svg.addEventListener('wheel', handleWheel);
    
    // 设置初始光标样式
    svg.style.cursor = 'grab';
    
    // 添加按钮事件监听
    document.getElementById('zoom-in').addEventListener('click', () => {
        // 放大按钮
        const newZoom = Math.min(MAP_CONFIG.maxZoom, mapState.zoom + MAP_CONFIG.zoomStep);
        mapState.zoom = newZoom;
        updateTransform();
    });
    
    document.getElementById('zoom-out').addEventListener('click', () => {
        // 缩小按钮
        const newZoom = Math.max(MAP_CONFIG.minZoom, mapState.zoom - MAP_CONFIG.zoomStep);
        mapState.zoom = newZoom;
        updateTransform();
    });
    
    document.getElementById('reset-view').addEventListener('click', () => {
        // 重置视图
        mapState.zoom = 1;
        mapState.pan = { x: 0, y: 0 };
        updateTransform();
    });
}

/**
 * 更新地图变换
 */
function updateTransform() {
    // 获取图层元素
    const buildingLayer = document.getElementById('building-layer');
    const pathLayer = document.getElementById('path-layer');
    const labelLayer = document.getElementById('label-layer');
    const highlightLayer = document.getElementById('highlight-layer');
    
    // 设置变换
    const transform = `translate(${mapState.pan.x}px, ${mapState.pan.y}px) scale(${mapState.zoom})`;
    buildingLayer.style.transform = transform;
    pathLayer.style.transform = transform;
    labelLayer.style.transform = transform;
    highlightLayer.style.transform = transform;
}

/**
 * 渲染地图元素
 * @param {Array} locations - 地点数据
 * @param {Array} paths - 路径数据
 * @param {string} campusFilter - 校区筛选，默认为'all'
 */
function renderMap(locations, paths, campusFilter = 'all') {
    // 保存当前校区筛选
    mapState.campusFilter = campusFilter;
    
    // 筛选当前校区的地点
    const filteredLocations = campusFilter === 'all' ? 
        locations : 
        locations.filter(loc => loc.campus === campusFilter);
    
    // 获取地点ID集合
    const locationIds = new Set(filteredLocations.map(loc => loc.id));
    
    // 筛选路径
    const filteredPaths = paths.filter(path => 
        locationIds.has(path.start) && locationIds.has(path.end)
    );
    
    // 渲染路径
    renderPaths(filteredPaths);
    
    // 渲染建筑物
    renderBuildings(filteredLocations);
    
    // 渲染标签
    renderLabels(filteredLocations);
}

/**
 * 渲染路径
 * @param {Array} paths - 路径数据
 */
function renderPaths(paths) {
    const pathLayer = document.getElementById('path-layer');
    if (!pathLayer) return;
    
    // 清空路径层
    pathLayer.innerHTML = '';
    
    // 创建路径元素
    paths.forEach(path => {
        // 获取起点和终点位置
        const start = CampusData.getLocationById(path.start);
        const end = CampusData.getLocationById(path.end);
        
        if (!start || !end) return;
        
        // 计算路径坐标
        const x1 = start.position.x / 100 * MAP_CONFIG.width;
        const y1 = start.position.y / 100 * MAP_CONFIG.height;
        const x2 = end.position.x / 100 * MAP_CONFIG.width;
        const y2 = end.position.y / 100 * MAP_CONFIG.height;
        
        // 创建路径线
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', '#aab');
        line.setAttribute('stroke-width', '2');
        
        // 添加到路径层
        pathLayer.appendChild(line);
    });
}

/**
 * 渲染建筑物
 * @param {Array} locations - 地点数据
 */
function renderBuildings(locations) {
    const buildingLayer = document.getElementById('building-layer');
    if (!buildingLayer) return;
    
    // 清空建筑物层
    buildingLayer.innerHTML = '';
    
    // 创建建筑物元素
    locations.forEach(location => {
        // 计算建筑物坐标
        const cx = location.position.x / 100 * MAP_CONFIG.width;
        const cy = location.position.y / 100 * MAP_CONFIG.height;
        
        // 创建圆形表示建筑物
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', cx);
        circle.setAttribute('cy', cy);
        circle.setAttribute('r', MAP_CONFIG.buildingRadius);
        
        // 设置建筑物类型样式
        let buildingClass = 'building';
        if (location.category === CATEGORY.DORMITORY) {
            buildingClass += ' dormitory';
        } else if (location.category === CATEGORY.DINING) {
            buildingClass += ' dining';
        } else if (location.category === CATEGORY.STUDY) {
            buildingClass += ' study';
        } else if (location.category === CATEGORY.SPORTS) {
            buildingClass += ' sports';
        } else if (location.category === CATEGORY.ENTRANCE) {
            buildingClass += ' entrance';
        }
        
        // 如果是选中的建筑物，添加选中样式
        if (location.id === mapState.selectedLocationId) {
            buildingClass += ' selected';
        }
        
        circle.setAttribute('class', buildingClass);
        circle.setAttribute('data-id', location.id);
        
        // 添加点击事件处理
        circle.addEventListener('click', () => selectLocation(location.id));
        
        // 添加工具提示
        circle.setAttribute('title', location.name);
        
        // 添加到建筑物层
        buildingLayer.appendChild(circle);
    });
}

/**
 * 渲染标签
 * @param {Array} locations - 地点数据
 */
function renderLabels(locations) {
    const labelLayer = document.getElementById('label-layer');
    if (!labelLayer) return;
    
    // 清空标签层
    labelLayer.innerHTML = '';
    
    // 创建标签元素
    locations.forEach(location => {
        // 计算标签坐标
        const x = location.position.x / 100 * MAP_CONFIG.width;
        const y = location.position.y / 100 * MAP_CONFIG.height + MAP_CONFIG.buildingRadius + 15;
        
        // 创建标签文本
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x);
        text.setAttribute('y', y);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('class', 'location-label');
        text.setAttribute('data-id', location.id);
        text.textContent = location.name;
        
        // 添加点击事件处理
        text.addEventListener('click', () => selectLocation(location.id));
        
        // 添加到标签层
        labelLayer.appendChild(text);
    });
}

/**
 * 选择地点
 * @param {number} locationId - 地点ID
 */
function selectLocation(locationId) {
    // 更新选中的地点ID
    mapState.selectedLocationId = locationId;
    
    // 触发地点选择事件
    const event = new CustomEvent('location-selected', {
        detail: {
            locationId: locationId
        }
    });
    document.dispatchEvent(event);
    
    // 刷新地图
    const locations = CampusData.getLocations(mapState.campusFilter);
    const paths = CampusData.getPaths();
    renderBuildings(locations);
    renderLabels(locations);
}

/**
 * 高亮显示路径
 * @param {Array} path - 路径节点ID数组
 */
function highlightPath(path) {
    const highlightLayer = document.getElementById('highlight-layer');
    if (!highlightLayer) return;
    
    // 清空高亮层
    highlightLayer.innerHTML = '';
    
    // 如果路径为空，直接返回
    if (!path || path.length < 2) return;
    
    // 保存高亮路径
    mapState.hightlightedPath = path;
    
    // 创建路径多段线
    const points = [];
    for (const locationId of path) {
        const location = CampusData.getLocationById(locationId);
        if (location) {
            const x = location.position.x / 100 * MAP_CONFIG.width;
            const y = location.position.y / 100 * MAP_CONFIG.height;
            points.push(`${x},${y}`);
        }
    }
    
    // 创建折线
    const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    polyline.setAttribute('points', points.join(' '));
    polyline.setAttribute('class', 'path');
    
    // 添加到高亮层
    highlightLayer.appendChild(polyline);
    
    // 更新选中的地点
    mapState.selectedLocationId = path[0];
    
    // 刷新建筑物和标签
    const locations = CampusData.getLocations(mapState.campusFilter);
    renderBuildings(locations);
}

/**
 * 设置地图校区筛选
 * @param {string} campus - 校区标识（'all', 'west-north', 'east-south', 'qiyi'）
 */
function setCampusFilter(campus) {
    // 更新校区筛选
    mapState.campusFilter = campus;
    
    // 重新渲染地图
    const locations = CampusData.getLocations(campus);
    const paths = CampusData.getPaths();
    renderMap(locations, paths, campus);
}

// 导出模块
const MapView = {
    initMap,
    renderMap,
    highlightPath,
    setCampusFilter
}; 