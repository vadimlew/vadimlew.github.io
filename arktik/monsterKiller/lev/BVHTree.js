// Функция для вычисления ограничивающего прямоугольника для массива окружностей
function boundingBox(circles) {
  // Инициализировать минимальные и максимальные координаты
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  // Перебрать все окружности
  for (let circle of circles) {
    // Обновить минимальные и максимальные координаты с учетом радиуса окружности
    minX = Math.min(minX, circle.x - circle.r);
    minY = Math.min(minY, circle.y - circle.r);
    maxX = Math.max(maxX, circle.x + circle.r);
    maxY = Math.max(maxY, circle.y + circle.r);
  }
  // Вернуть объект с координатами ограничивающего прямоугольника
  return {minX, minY, maxX, maxY};
}

// Функция для разбиения массива окружностей на два подмассива по самому длинному измерению ограничивающего прямоугольника
function splitByLongestDimension(circles) {
  // Вычислить ограничивающий прямоугольник для массива окружностей
  let box = boundingBox(circles);
  // Определить самое длинное измерение (ширина или высота)
  let longestDimension = box.maxX - box.minX > box.maxY - box.minY ? "x" : "y";
  // Отсортировать массив окружностей по координате самого длинного измерения
  circles.sort((a, b) => a[longestDimension] - b[longestDimension]);
  // Разделить массив пополам и вернуть два подмассива
  let mid = Math.floor(circles.length / 2);
  return [circles.slice(0, mid), circles.slice(mid)];
}

// Функция для построения BVH-дерева из массива окружностей
function buildBVHTree(circles, maxCirclesPerNode = 10) {
  // Создать корневой узел дерева
  let root = {circles};
  // Рекурсивно разбивать узел на подузлы
  function splitNode(node) {
    // Если в узле меньше или равно заданного количества окружностей, то не разбивать его
    if (node.circles.length <= maxCirclesPerNode) return;
    // Разбить массив окружностей на два подмассива по самому длинному измерению ограничивающего прямоугольника
    let [leftCircles, rightCircles] = splitByLongestDimension(node.circles);
    // Создать два подузла и добавить их в дерево
    node.left = {circles: leftCircles};
    node.right = {circles: rightCircles};
    // Рекурсивно разбить подузлы
    splitNode(node.left);
    splitNode(node.right);
  }
  splitNode(root);
  // Вычислить ограничивающий объем для каждого узла дерева
  function computeBoundingVolume(node) {
    // Если узел является листом, то вычислить ограничивающий прямоугольник для его окружностей
    if (!node.left && !node.right) {
      node.box = boundingBox(node.circles);
      return;
    }
    // Вычислить ограничивающий объем для подузлов
    computeBoundingVolume(node.left);
    computeBoundingVolume(node.right);
    // Вычислить ограничивающий объем для текущего узла как объединение ограничивающих объемов подузлов
    node.box = {
      minX: Math.min(node.left.box.minX, node.right.box.minX),
      minY: Math.min(node.left.box.minY, node.right.box.minY),
      maxX: Math.max(node.left.box.maxX, node.right.box.maxX),
      maxY: Math.max(node.left.box.maxY, node.right.box.maxY)
    };
  }
  computeBoundingVolume(root);
  // Вернуть корневой узел дерева
  return root;
}
