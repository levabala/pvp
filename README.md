#### DM на инскуственных интелектах(каждый игрок сам пишет)
**Что осталось сделать?**

1. Сделать нормальный радар(оптимизированный)
2. Сделать, чтобы ИИ одного игрока не убегало вперед другого(новый тик после ответа каждого ИИ)
3. Добавить стрельбу
4. Рандом по сиду
5. Генерация мира и генерация позиции для спавна игроков

**Вот пример отправки с ИИ на движок команд:**

`
postMessage({action: ['moveBack','rotateRightGun', 'rotateRightBody']});
`

**Всего существует 7 команд:

1. `rotateRightBody` - Поворачивать вправо.
2. `rotateLeftBody` - Поворачивать влево.
3. `rotateRightGun` - Поворачивать вправо пушку.
4. `rotateLeftGun` - Поворачивать влево пушку.
5. `moveForward` - Движение вперед.
6. `moveBack` - Движение назад.
7. `shoot` - Стрельба.
