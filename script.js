/**
 * 南阳理工学院校园导航系统
 * 主脚本文件
 * 作者：杨博文（2415929683）
 * 完成日期：2025.5.20
 */

// 当页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // 初始化地图
    MapView.initMap('campus-map');
    
    // 渲染初始地图
    const locations = CampusData.getLocations();
    const paths = CampusData.getPaths();
    MapView.renderMap(locations, paths);
    
    // 初始化地点列表
    initLocationList();
    
    // 初始化选择框
    initSelects();
    
    // 添加事件监听器
    addEventListeners();
    
    // 初始化工具提示
    initTooltips();
    
    // 显示欢迎信息
    showWelcomeAlert();
});

/**
 * 初始化地点列表
 */
function initLocationList() {
    const locationList = document.getElementById('location-list');
    if (!locationList) return;
    
    // 获取所有地点并按名称排序
    const locations = CampusData.getLocations();
    locations.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
    
    // 创建地点列表项
    locations.forEach(location => {
        const item = document.createElement('button');
        item.className = 'list-group-item list-group-item-action';
        item.setAttribute('data-id', location.id);
        item.textContent = location.name;
        
        // 添加点击事件
        item.addEventListener('click', () => {
            selectLocation(location.id);
        });
        
        // 添加到列表
        locationList.appendChild(item);
    });
}

/**
 * 初始化起点和终点选择框
 */
function initSelects() {
    const startSelect = document.getElementById('start-location');
    const endSelect = document.getElementById('end-location');
    if (!startSelect || !endSelect) return;
    
    // 获取所有地点并按名称排序
    const locations = CampusData.getLocations();
    locations.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
    
    // 按校区分组
    const campusGroups = {
        [CAMPUS.WEST_NORTH]: document.createElement('optgroup'),
        [CAMPUS.EAST_SOUTH]: document.createElement('optgroup')
    };
    
    // 设置分组标签
    campusGroups[CAMPUS.WEST_NORTH].label = '西北校区(北校区)';
    campusGroups[CAMPUS.EAST_SOUTH].label = '东南校区(东校区)';
    
    // 创建选项
    locations.forEach(location => {
        const option = document.createElement('option');
        option.value = location.id;
        option.textContent = location.name;
        
        // 添加到对应的分组
        if (campusGroups[location.campus]) {
            campusGroups[location.campus].appendChild(option.cloneNode(true));
        }
    });
    
    // 添加分组到选择框
    for (const campus in campusGroups) {
        if (campusGroups[campus].hasChildNodes()) {
            startSelect.appendChild(campusGroups[campus].cloneNode(true));
            endSelect.appendChild(campusGroups[campus].cloneNode(true));
        }
    }
}

/**
 * 添加事件监听器
 */
function addEventListeners() {
    // 校区切换
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            
            // 更新激活状态
            document.querySelectorAll('.navbar-nav .nav-link').forEach(item => {
                item.classList.remove('active');
            });
            link.classList.add('active');
            
            // 设置校区筛选
            const campus = link.getAttribute('data-campus');
            MapView.setCampusFilter(campus);
            
            // 更新地点列表
            updateLocationList(campus);
        });
    });
    
    // 分类筛选
    document.querySelectorAll('.list-group-item[data-category]').forEach(item => {
        item.addEventListener('click', () => {
            // 更新激活状态
            document.querySelectorAll('.list-group-item[data-category]').forEach(btn => {
                btn.classList.remove('active');
            });
            item.classList.add('active');
            
            // 获取分类
            const category = item.getAttribute('data-category');
            
            // 更新地点列表
            updateLocationList(MapView.mapState?.campusFilter || 'all', category);
        });
    });
    
    // 搜索
    document.getElementById('search-button').addEventListener('click', handleSearch);
    document.getElementById('search-input').addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    });
    
    // 路径查询表单
    document.getElementById('path-form').addEventListener('submit', (event) => {
        event.preventDefault();
        findPath();
    });
    
    // 选择地点
    document.addEventListener('location-selected', (event) => {
        const locationId = event.detail.locationId;
        
        // 高亮显示列表项
        highlightLocationInList(locationId);
        
        // 显示地点信息
        showLocationInfo(locationId);
    });
}

/**
 * 更新地点列表
 * @param {string} campus - 校区筛选
 * @param {string} category - 类别筛选
 */
function updateLocationList(campus = 'all', category = 'all') {
    const locationList = document.getElementById('location-list');
    if (!locationList) return;
    
    // 清空列表
    locationList.innerHTML = '';
    
    // 获取筛选后的地点
    const locations = CampusData.getLocations(campus, category);
    locations.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
    
    // 创建地点列表项
    locations.forEach(location => {
        const item = document.createElement('button');
        item.className = 'list-group-item list-group-item-action';
        item.setAttribute('data-id', location.id);
        item.textContent = location.name;
        
        // 添加点击事件
        item.addEventListener('click', () => {
            selectLocation(location.id);
        });
        
        // 添加到列表
        locationList.appendChild(item);
    });
}

/**
 * 处理搜索
 */
function handleSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    
    const keyword = searchInput.value.trim();
    if (!keyword) return;
    
    // 搜索地点
    const results = CampusData.searchLocations(keyword);
    
    // 如果只有一个结果，直接选中
    if (results.length === 1) {
        selectLocation(results[0].id);
        return;
    }
    
    // 更新地点列表显示搜索结果
    const locationList = document.getElementById('location-list');
    if (!locationList) return;
    
    // 清空列表
    locationList.innerHTML = '';
    
    // 显示搜索结果数量
    const searchResultCount = document.createElement('div');
    searchResultCount.className = 'alert alert-info';
    searchResultCount.textContent = `找到 ${results.length} 个结果`;
    locationList.appendChild(searchResultCount);
    
    // 创建搜索结果列表项
    results.forEach(location => {
        const item = document.createElement('button');
        item.className = 'list-group-item list-group-item-action';
        item.setAttribute('data-id', location.id);
        
        // 创建结果项内容
        const nameSpan = document.createElement('span');
        nameSpan.className = 'fw-bold';
        nameSpan.textContent = location.name;
        
        const descSpan = document.createElement('span');
        descSpan.className = 'text-muted ms-2';
        descSpan.textContent = `(${location.category})`;
        
        item.appendChild(nameSpan);
        item.appendChild(descSpan);
        
        // 添加点击事件
        item.addEventListener('click', () => {
            selectLocation(location.id);
        });
        
        // 添加到列表
        locationList.appendChild(item);
    });
}

/**
 * 选择地点
 * @param {number} locationId - 地点ID
 */
function selectLocation(locationId) {
    // 更新地图上的选中状态
    MapView.mapState.selectedLocationId = locationId;
    
    // 刷新地图
    const locations = CampusData.getLocations(MapView.mapState.campusFilter);
    const paths = CampusData.getPaths();
    MapView.renderBuildings(locations);
    
    // 触发地点选择事件
    const event = new CustomEvent('location-selected', {
        detail: {
            locationId: locationId
        }
    });
    document.dispatchEvent(event);
}

/**
 * 高亮显示列表中的地点
 * @param {number} locationId - 地点ID
 */
function highlightLocationInList(locationId) {
    // 移除所有高亮
    document.querySelectorAll('#location-list .list-group-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // 高亮选中项
    const selectedItem = document.querySelector(`#location-list .list-group-item[data-id="${locationId}"]`);
    if (selectedItem) {
        selectedItem.classList.add('active');
        
        // 滚动到可见区域
        selectedItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

/**
 * 显示地点信息
 * @param {number} locationId - 地点ID
 */
function showLocationInfo(locationId) {
    const location = CampusData.getLocationById(locationId);
    if (!location) return;
    
    // 可以在这里添加显示地点详细信息的逻辑
    console.log('选中地点:', location.name);
    
    // 填充路径查询表单
    if (document.getElementById('start-location').value === '') {
        document.getElementById('start-location').value = locationId;
    } else if (document.getElementById('end-location').value === '') {
        document.getElementById('end-location').value = locationId;
    }
}

/**
 * 查找路径
 */
function findPath() {
    const startId = parseInt(document.getElementById('start-location').value);
    const endId = parseInt(document.getElementById('end-location').value);
    const pathType = document.querySelector('input[name="path-type"]:checked').value;
    
    // 验证起点和终点
    if (isNaN(startId) || isNaN(endId)) {
        showAlert('请选择起点和终点', 'warning');
        return;
    }
    
    if (startId === endId) {
        showAlert('起点和终点不能相同', 'warning');
        return;
    }
    
    // 获取图结构
    const graph = CampusData.getGraph();
    
    // 查找路径
    const result = PathFinding.findShortestPath(graph, startId, endId, pathType);
    
    // 检查是否找到路径
    if (!result.path.length) {
        showAlert('没有找到可行路径', 'danger');
        return;
    }
    
    // 高亮显示路径
    MapView.highlightPath(result.path);
    
    // 显示路径结果
    showPathResult(result);
}

/**
 * 显示路径结果
 * @param {Object} result - 路径查询结果
 */
function showPathResult(result) {
    const pathResults = document.getElementById('path-results');
    const totalDistance = document.getElementById('total-distance');
    const totalTime = document.getElementById('total-time');
    const pathDetails = document.getElementById('path-details');
    
    if (!pathResults || !totalDistance || !totalTime || !pathDetails) return;
    
    // 显示结果区域
    pathResults.classList.remove('d-none');
    
    // 更新总距离和总时间
    totalDistance.textContent = result.totalDistance;
    totalTime.textContent = result.totalTime;
    
    // 清空路径详情
    pathDetails.innerHTML = '';
    
    // 添加路径详情
    result.path.forEach((locationId, index) => {
        const location = CampusData.getLocationById(locationId);
        if (!location) return;
        
        const listItem = document.createElement('li');
        
        if (index === 0) {
            // 起点
            listItem.innerHTML = `<strong>起点:</strong> ${location.name}`;
        } else if (index === result.path.length - 1) {
            // 终点
            listItem.innerHTML = `<strong>终点:</strong> ${location.name}`;
        } else {
            // 中间点
            listItem.textContent = location.name;
        }
        
        pathDetails.appendChild(listItem);
    });
}

/**
 * 显示提示信息
 * @param {string} message - 提示消息
 * @param {string} type - 提示类型 (success, info, warning, danger)
 */
function showAlert(message, type = 'info') {
    // 创建警告框容器
    const alertContainer = document.createElement('div');
    alertContainer.className = 'alert-container position-fixed top-0 start-50 translate-middle-x p-3';
    alertContainer.style.zIndex = '9999';
    
    // 创建警告框
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.role = 'alert';
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="关闭"></button>
    `;
    
    // 添加到容器
    alertContainer.appendChild(alert);
    
    // 添加到文档
    document.body.appendChild(alertContainer);
    
    // 自动关闭
    setTimeout(() => {
        alert.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(alertContainer);
        }, 150);
    }, 5000);
}

/**
 * 初始化工具提示
 */
function initTooltips() {
    // Bootstrap工具提示需要初始化
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[title]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

/**
 * 显示欢迎信息
 */
function showWelcomeAlert() {
    const welcomeMessage = `
        <h5>欢迎使用南阳理工学院校园导航系统！</h5>
        <p>本系统提供校园内的路径规划和导航服务。</p>
        <ul>
            <li>点击左侧地点列表或地图上的标记可查看详细信息</li>
            <li>使用右侧面板可进行路径查询</li>
            <li>支持按最短距离或最短时间进行路径规划</li>
        </ul>
        <p class="mb-0"><small>作者：杨博文（2415929683） - 完成日期：2025.5.20</small></p>
    `;
    showAlert(welcomeMessage, 'info', 10000);
} 