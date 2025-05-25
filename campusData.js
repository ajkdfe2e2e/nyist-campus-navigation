/**
 * 南阳理工学院校园数据
 * 包含校区、建筑、路径等信息
 * 基于高德地图真实数据修正
 * 作者：杨博文（2415929683）
 * 完成日期：2025.5.20
 */

// 校区定义
const CAMPUS = {
    WEST_NORTH: 'west-north', // 西北校区(北校区)，位于长江路80号
    EAST_SOUTH: 'east-south', // 东南校区(东校区)
};

// 地点类别定义
const CATEGORY = {
    TEACHING: '教学楼',
    DORMITORY: '宿舍',
    DINING: '餐饮',
    STUDY: '学习场所',
    SPORTS: '运动场所',
    ENTRANCE: '出入口',
    ADMIN: '行政',
    MEDICAL: '医疗',
    SERVICE: '生活服务',
};

/**
 * 地点数据
 * id: 唯一标识
 * name: 地点名称
 * description: 地点描述
 * category: 地点类别
 * campus: 所属校区
 * position: 在地图上的坐标 (相对坐标，范围0-100)
 * geoposition: 实际地理坐标（经度，纬度），基于高德地图
 */
const locations = [
    // 西北校区(北校区) - 出入口
    { id: 0, name: '北校门', description: '北校区主要入口，位于长江路80号', category: CATEGORY.ENTRANCE, campus: CAMPUS.WEST_NORTH, position: { x: 5, y: 50 }, geoposition: { lng: 112.498587, lat: 32.965935 } },
    
    // 西北校区(北校区) - 教学区
    { id: 1, name: '1号教学楼', description: '主要用于理工科教学', category: CATEGORY.TEACHING, campus: CAMPUS.WEST_NORTH, position: { x: 20, y: 30 }, geoposition: { lng: 112.499237, lat: 32.966823 } },
    { id: 2, name: '2号教学楼', description: '主要用于经管类课程', category: CATEGORY.TEACHING, campus: CAMPUS.WEST_NORTH, position: { x: 30, y: 30 }, geoposition: { lng: 112.500310, lat: 32.966823 } },
    { id: 3, name: '3号教学楼', description: '主要用于文科类课程', category: CATEGORY.TEACHING, campus: CAMPUS.WEST_NORTH, position: { x: 40, y: 30 }, geoposition: { lng: 112.501383, lat: 32.966823 } },
    { id: 4, name: '4号教学楼', description: '各专业实验室和教室', category: CATEGORY.TEACHING, campus: CAMPUS.WEST_NORTH, position: { x: 25, y: 15 }, geoposition: { lng: 112.499773, lat: 32.965047 } },
    
    // 西北校区(北校区) - 宿舍区
    { id: 5, name: '1号宿舍楼', description: '男生宿舍', category: CATEGORY.DORMITORY, campus: CAMPUS.WEST_NORTH, position: { x: 15, y: 70 }, geoposition: { lng: 112.498773, lat: 32.968599 } },
    { id: 6, name: '2号宿舍楼', description: '男生宿舍', category: CATEGORY.DORMITORY, campus: CAMPUS.WEST_NORTH, position: { x: 25, y: 70 }, geoposition: { lng: 112.499773, lat: 32.968599 } },
    { id: 7, name: '3号宿舍楼', description: '男生宿舍', category: CATEGORY.DORMITORY, campus: CAMPUS.WEST_NORTH, position: { x: 35, y: 70 }, geoposition: { lng: 112.500773, lat: 32.968599 } },
    { id: 8, name: '7号宿舍楼', description: '女生宿舍', category: CATEGORY.DORMITORY, campus: CAMPUS.WEST_NORTH, position: { x: 45, y: 70 }, geoposition: { lng: 112.501773, lat: 32.968599 } },
    { id: 9, name: '8号宿舍楼', description: '女生宿舍', category: CATEGORY.DORMITORY, campus: CAMPUS.WEST_NORTH, position: { x: 55, y: 70 }, geoposition: { lng: 112.502773, lat: 32.968599 } },
    
    // 西北校区(北校区) - 餐饮
    { id: 10, name: '学苑餐厅', description: '北校区主食堂，提供多种风味餐饮', category: CATEGORY.DINING, campus: CAMPUS.WEST_NORTH, position: { x: 30, y: 50 }, geoposition: { lng: 112.500310, lat: 32.967711 } },
    
    // 西北校区(北校区) - 学习场所
    { id: 11, name: '图书馆', description: '北校区图书馆，馆藏丰富', category: CATEGORY.STUDY, campus: CAMPUS.WEST_NORTH, position: { x: 20, y: 40 }, geoposition: { lng: 112.499237, lat: 32.967267 } },
    
    // 西北校区(北校区) - 运动场所
    { id: 12, name: '体育馆', description: '室内体育场馆', category: CATEGORY.SPORTS, campus: CAMPUS.WEST_NORTH, position: { x: 50, y: 20 }, geoposition: { lng: 112.502456, lat: 32.965491 } },
    { id: 13, name: '田径场', description: '标准400米跑道', category: CATEGORY.SPORTS, campus: CAMPUS.WEST_NORTH, position: { x: 65, y: 20 }, geoposition: { lng: 112.503956, lat: 32.965491 } },
    
    // 东南校区(东校区) - 出入口
    { id: 14, name: '东校门', description: '东校区的主要入口', category: CATEGORY.ENTRANCE, campus: CAMPUS.EAST_SOUTH, position: { x: 95, y: 50 }, geoposition: { lng: 112.595052, lat: 33.012467 } },
    
    // 东南校区(东校区) - 教学区
    { id: 15, name: '17号教学楼', description: '东校区主教学楼', category: CATEGORY.TEACHING, campus: CAMPUS.EAST_SOUTH, position: { x: 80, y: 30 }, geoposition: { lng: 112.593552, lat: 33.011467 } },
    { id: 16, name: '实训大楼', description: '创新创业教育中心和实训基地', category: CATEGORY.TEACHING, campus: CAMPUS.EAST_SOUTH, position: { x: 70, y: 30 }, geoposition: { lng: 112.592052, lat: 33.011467 } },
    
    // 东南校区(东校区) - 宿舍区
    { id: 17, name: '11号宿舍楼', description: '男生宿舍', category: CATEGORY.DORMITORY, campus: CAMPUS.EAST_SOUTH, position: { x: 65, y: 70 }, geoposition: { lng: 112.591302, lat: 33.014467 } },
    { id: 18, name: '12号宿舍楼', description: '男生宿舍', category: CATEGORY.DORMITORY, campus: CAMPUS.EAST_SOUTH, position: { x: 75, y: 70 }, geoposition: { lng: 112.592802, lat: 33.014467 } },
    { id: 19, name: '15号宿舍楼', description: '女生宿舍', category: CATEGORY.DORMITORY, campus: CAMPUS.EAST_SOUTH, position: { x: 85, y: 70 }, geoposition: { lng: 112.594302, lat: 33.014467 } },
    
    // 东南校区(东校区) - 餐饮
    { id: 20, name: '东苑餐厅', description: '东校区食堂，环境优美', category: CATEGORY.DINING, campus: CAMPUS.EAST_SOUTH, position: { x: 75, y: 50 }, geoposition: { lng: 112.592802, lat: 33.013467 } },
    
    // 东南校区(东校区) - 学习场所
    { id: 21, name: '东区图书馆', description: '东校区图书馆，现代化设施', category: CATEGORY.STUDY, campus: CAMPUS.EAST_SOUTH, position: { x: 85, y: 40 }, geoposition: { lng: 112.594302, lat: 33.012467 } },
    
    // 东南校区(东校区) - 运动场所
    { id: 22, name: '东区体育场', description: '综合性体育场', category: CATEGORY.SPORTS, campus: CAMPUS.EAST_SOUTH, position: { x: 75, y: 20 }, geoposition: { lng: 112.592802, lat: 33.010467 } },
    
    // 公共服务设施
    { id: 23, name: '校医院', description: '提供基本医疗服务，位于附属医院', category: CATEGORY.MEDICAL, campus: CAMPUS.WEST_NORTH, position: { x: 40, y: 50 }, geoposition: { lng: 112.501383, lat: 32.967711 } },
    { id: 24, name: '行政楼', description: '学校行政办公中心', category: CATEGORY.ADMIN, campus: CAMPUS.WEST_NORTH, position: { x: 40, y: 40 }, geoposition: { lng: 112.501383, lat: 32.967267 } },
    { id: 25, name: '学生活动中心', description: '学生社团活动场所', category: CATEGORY.SERVICE, campus: CAMPUS.EAST_SOUTH, position: { x: 60, y: 50 }, geoposition: { lng: 112.590302, lat: 33.013467 } },
    { id: 26, name: '超市', description: '校内超市', category: CATEGORY.SERVICE, campus: CAMPUS.WEST_NORTH, position: { x: 30, y: 60 }, geoposition: { lng: 112.500310, lat: 32.968155 } },
    { id: 27, name: '信息工程学院', description: '计算机与软件相关专业', category: CATEGORY.TEACHING, campus: CAMPUS.WEST_NORTH, position: { x: 35, y: 35 }, geoposition: { lng: 112.500773, lat: 32.966823 } },
    { id: 28, name: '智能制造学院', description: '机械、自动化等专业', category: CATEGORY.TEACHING, campus: CAMPUS.WEST_NORTH, position: { x: 45, y: 35 }, geoposition: { lng: 112.502056, lat: 32.966823 } },
    { id: 29, name: '文法学院', description: '文学与法学专业', category: CATEGORY.TEACHING, campus: CAMPUS.WEST_NORTH, position: { x: 45, y: 40 }, geoposition: { lng: 112.502056, lat: 32.967267 } },
    { id: 30, name: '人才公寓', description: '教师及高层次人才住宿', category: CATEGORY.DORMITORY, campus: CAMPUS.EAST_SOUTH, position: { x: 90, y: 60 }, geoposition: { lng: 112.594802, lat: 33.013967 } },
];

/**
 * 路径数据
 * start: 起点ID
 * end: 终点ID
 * distance: 两点间距离(米)
 * time: 步行时间(分钟)
 */
const paths = [
    // 西北校区内部连接
    { start: 0, end: 1, distance: 300, time: 4 },
    { start: 0, end: 10, distance: 500, time: 6 },
    { start: 1, end: 2, distance: 150, time: 2 },
    { start: 2, end: 3, distance: 150, time: 2 },
    { start: 1, end: 4, distance: 200, time: 3 },
    { start: 2, end: 4, distance: 200, time: 3 },
    { start: 1, end: 11, distance: 150, time: 2 },
    { start: 10, end: 11, distance: 200, time: 3 },
    { start: 3, end: 12, distance: 250, time: 3 },
    { start: 12, end: 13, distance: 200, time: 3 },
    { start: 10, end: 5, distance: 300, time: 4 },
    { start: 10, end: 6, distance: 300, time: 4 },
    { start: 10, end: 7, distance: 300, time: 4 },
    { start: 5, end: 6, distance: 100, time: 1 },
    { start: 6, end: 7, distance: 100, time: 1 },
    { start: 7, end: 8, distance: 100, time: 1 },
    { start: 8, end: 9, distance: 100, time: 1 },
    { start: 10, end: 23, distance: 150, time: 2 },
    { start: 23, end: 24, distance: 150, time: 2 },
    { start: 10, end: 26, distance: 200, time: 3 },
    { start: 2, end: 27, distance: 120, time: 1.5 },
    { start: 3, end: 28, distance: 120, time: 1.5 },
    { start: 3, end: 29, distance: 150, time: 2 },
    { start: 24, end: 29, distance: 100, time: 1.2 },
    
    // 东南校区内部连接
    { start: 14, end: 15, distance: 300, time: 4 },
    { start: 14, end: 20, distance: 400, time: 5 },
    { start: 15, end: 16, distance: 150, time: 2 },
    { start: 15, end: 21, distance: 200, time: 2 },
    { start: 15, end: 22, distance: 250, time: 3 },
    { start: 20, end: 17, distance: 300, time: 4 },
    { start: 20, end: 18, distance: 300, time: 4 },
    { start: 20, end: 19, distance: 300, time: 4 },
    { start: 17, end: 18, distance: 100, time: 1 },
    { start: 18, end: 19, distance: 100, time: 1 },
    { start: 20, end: 25, distance: 200, time: 3 },
    { start: 19, end: 30, distance: 150, time: 2 },
    { start: 14, end: 30, distance: 350, time: 4.5 },
    
    // 校区间连接 - 实际需要公交或校车，距离较远
    { start: 13, end: 16, distance: 8500, time: 35 },
    { start: 13, end: 22, distance: 8500, time: 35 },
    { start: 7, end: 17, distance: 8500, time: 35 },
    { start: 9, end: 19, distance: 8500, time: 35 },
    { start: 10, end: 20, distance: 8500, time: 35 },
];

/**
 * 获取所有地点
 * @param {string} campus - 校区筛选 (可选)
 * @param {string} category - 类别筛选 (可选)
 * @returns {Array} 筛选后的地点数组
 */
function getLocations(campus, category) {
    return locations.filter(location => {
        const campusMatch = !campus || campus === 'all' || location.campus === campus;
        const categoryMatch = !category || category === 'all' || location.category === category;
        return campusMatch && categoryMatch;
    });
}

/**
 * 根据ID获取地点信息
 * @param {number} id - 地点ID
 * @returns {Object|null} 地点信息对象，未找到则返回null
 */
function getLocationById(id) {
    return locations.find(location => location.id === id) || null;
}

/**
 * 根据名称搜索地点
 * @param {string} keyword - 搜索关键词
 * @returns {Array} 符合条件的地点数组
 */
function searchLocations(keyword) {
    if (!keyword) return [];
    const lowerKeyword = keyword.toLowerCase();
    return locations.filter(
        location => location.name.toLowerCase().includes(lowerKeyword) ||
                   location.description.toLowerCase().includes(lowerKeyword)
    );
}

/**
 * 获取路径数据
 * @returns {Array} 所有路径数据
 */
function getPaths() {
    return paths;
}

/**
 * 获取邻接表表示的图结构
 * @returns {Object} 包含顶点数组和邻接表的图结构
 */
function getGraph() {
    const graph = {
        vertices: locations.map(location => location.id),
        adjacencyList: {}
    };
    
    // 初始化邻接表
    locations.forEach(location => {
        graph.adjacencyList[location.id] = [];
    });
    
    // 填充邻接表
    paths.forEach(path => {
        graph.adjacencyList[path.start].push({
            vertex: path.end,
            distance: path.distance,
            time: path.time
        });
        
        // 无向图，添加反向边
        graph.adjacencyList[path.end].push({
            vertex: path.start,
            distance: path.distance,
            time: path.time
        });
    });
    
    return graph;
}

// 导出模块
const CampusData = {
    CAMPUS,
    CATEGORY,
    getLocations,
    getLocationById,
    searchLocations,
    getPaths,
    getGraph
}; 