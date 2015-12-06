#### DM на инскуственных интелектах(каждый игрок сам пишет)
*Информация предварительная и может редактироваться.*

**Что осталось сделать?**

1. Сделать нормальный радар(оптимизированный)
2. Сделать, чтобы ИИ одного игрока не убегало вперед другого(новый тик после ответа каждого ИИ)
3. Добавить стрельбу
4. Рандом по сиду
5. Генерация мира и генерация позиции для спавна игроков
6. Добавить здоровье
7. Регулирование скорость поворота танка/пушки

**Вот пример отправки с ИИ на движок команд:**

`
postMessage({action: ['moveBack','rotateRightGun', 'rotateRightBody']});
`

**Всего существует 7 команд:**

1. `rotateRightBody` - Поворачивать вправо.
2. `rotateLeftBody` - Поворачивать влево.
3. `rotateRightGun` - Поворачивать вправо пушку.
4. `rotateLeftGun` - Поворачивать влево пушку.
5. `moveForward` - Движение вперед.
6. `moveBack` - Движение назад.
7. `shoot` - Стрельба.

Вдальнейшем угл повороту будет изменяться ИИ и будет выставлен предел.

Отправлять их стоит отвечая на сообщения движка, которое будет выглядить похожем на это:

`Object { mePos: Array[2], visibleObj: Array[0], tick: 0 }`

**Cервера будет присылать следующее:**

1. Вашу позицию.
2. Угол поворота шасси.
3. Угол поворота пушки.
4. И расстояние до объекта, с которым будет сталкиваться невидимый вектор исходящий из пушки, его тип, координаты и если это игрок, то и уровень.
5. Ваш уровень здоровья.
