const storedBattleLog = sessionStorage.getItem('battleLog');
const battleLog = document.getElementById('battle-log');
if (storedBattleLog) {
  battleLog.innerHTML = storedBattleLog;
}

// Функция для сохранения battleLog в sessionStorage
function saveBattleLogToStorage() {
  sessionStorage.setItem('battleLog', battleLog.innerHTML);
}

// Персонажи и их характеристики
const characters = {
  human: { name: "Пехотинец", strength: 5, speed: 3, accuracy: 3, armor: 10 },
  cavalry: { name: "Кавалерия", strength: 10, speed: 5, accuracy: 4, armor: 6 },
  elf: { name: "Эльф", strength: 3, speed: 6, accuracy: 5, armor: 4 },
  orcLight: { name: "Легкий орк", strength: 7, speed: 4, accuracy: 2, armor: 6 },
  orcHeavy: { name: "Тяжелый орк", strength: 8, speed: 2, accuracy: 1, armor: 8 },
  wizard: { name: "Колдун", strength: 2, speed: 4, accuracy: 4, armor: 1 }
};


// Функция для рандомного выбора персонажей
function getRandomCharacterForFaction1() {
  const charactersArray = ['human', 'elf', 'wizard', 'cavalry'];
  const randomIndex = Math.floor(Math.random() * charactersArray.length);
  return charactersArray[randomIndex];
}


// Функция для склонения слов
function getRandomCharacterForFaction2() {
  const charactersArray = ['orcLight', 'orcHeavy', 'wizard'];
  const randomIndex = Math.floor(Math.random() * charactersArray.length);
  return charactersArray[randomIndex];
}

// Функция для начала битвы
document.getElementById('start-button').addEventListener('click', function () {
  const numFaction1 = parseInt(document.getElementById('faction1').value);
  const numFaction2 = parseInt(document.getElementById('faction2').value);

  if (isNaN(numFaction1) || isNaN(numFaction2)) {
      alert('Пожалуйста, введите число воинов для каждой фракции.');
      return;
  }

  // Создаем войска
  const army1 = createArmy(numFaction1, 1);
  const army2 = createArmy(numFaction2, 2);

  // Начинаем битву
  startBattle(army1, army2);
});

// Функция для создания войска
function createArmy(numFaction, whichFaction) {
  const army = [];

  if (whichFaction === 1) {
    for (let i = 0; i < numFaction; i++) {
      const characterType = getRandomCharacterForFaction1();
      army.push({ ...characters[characterType], side: 'фракция 1' });
  }
  return army
  } else {
    for (let i = 0; i < numFaction; i++) {
      const characterType = getRandomCharacterForFaction2();
      army.push({ ...characters[characterType], side: 'фракция 2' });
  }
  console.log(army)
  return army;
  }
}

// Функция для начала битвы
async function startBattle(army1, army2) {
  const battleLog = document.getElementById('battle-log');
  const winnerElement = document.getElementById('winner');

  let round = 1;

  while (army1.length > 0 && army2.length > 0) {

    if (army1.length === 0) {
      // Армия 1 уничтожена, армия 2 победила
      winnerElement.innerHTML = `Победители: Орки (${army2.length} ${declension(army2.length, ['воин', 'воина', 'воинов'])})`;
      break;
    }


    if (army2.length === 0) {
      // Армия 2 уничтожена, армия 1 победила
      winnerElement.innerHTML = `Победители: Люди и Эльфы (${army1.length} ${declension(army1.length, ['воин', 'воина', 'воинов'])})`;
      break;
    }

    battleLog.innerHTML += `
    <hr>
    <div class="battle-round">Раунд ${round}</div>
    `;
    // Определяем порядок атаки на основе скорости (speed) персонажей
    let attacker1, attacker2;
    if (Math.random() > 0.5) {
      attacker1 = army1.shift(); // Первым атакует персонаж из армии 1
      attacker2 = army2.shift();
    } else {
      attacker2 = army2.shift(); // Первым атакует персонаж из армии 2
      attacker1 = army1.shift();
    }

    // Анимация атаки и определение вероятности промаха
    const hitChance1 = 100 - attacker1.accuracy * 20;
    const hitChance2 = 100 - attacker2.accuracy * 20;
    if (Math.random() * 100 >= hitChance1) {
      // Атака персонажа 1 успешна
      const damage1 = attacker1.strength * (Math.random() + 0.5);
      attacker2.armor -= damage1; // Уменьшаем броню цели
      if (attacker1.name === 'Эльф' && Math.random() * 100 < 10) {
        // Эльф успешно убил противника
        battleLog.innerHTML += `${attacker1.name} из войска 1 моментально убил юнита ${attacker2.name} из войска 2<br>`;
      } else if (attacker1.name === 'Колдун') {
        // Колдун переманивает противника
        attacker2.side = 'фракция 1';
        army1.push(attacker2);
        battleLog.innerHTML += `${attacker1.name} из войска 1 переманил юнита ${attacker2.name} из войска 2<br>`;
      } else if (attacker1.name === 'Кавалерия' && Math.random() * 100 < 10 && ( attacker2.name === 'Легкий орк'|| attacker2.name === "Тяжелый орк")) {
        // Кавалерия бежит
        battleLog.innerHTML += `${attacker1.name} из войска 1 пропускает ход из-за орка противника 2<br>`;
      } else {
        if (attacker2.armor <= 0) {
          // Если броня кончилась, персонаж умирает
          battleLog.innerHTML += `${attacker1.name} из войска 1 убил юнита ${attacker2.name} из войска 2<br>`;
        } else {
          battleLog.innerHTML += `${attacker1.name} из войска 1 атаковал юнита ${attacker2.name} из войска 2, у него осталось ${attacker2.armor.toFixed(2)} ед здоровья<br>`;
          army2.push(attacker2); // Персонаж 2 возвращается в армию
        }
      }
      await animateDamage(attacker1, attacker2, damage1, 0, battleLog);
    } else {
      // Атака персонажа 1 промахнулась
      battleLog.innerHTML += `${attacker1.name} из войска 1 промахнулся по юниту ${attacker2.name} из войска 2<br>`;
      army1.push(attacker1); // Персонаж 1 возвращается в армию
    }

    if (army2.length === 0) {
      // Армия 2 уничтожена, армия 1 победила
      winnerElement.innerHTML = `Победители: Люди и Эльфы (${army1.length} ${declension(army1.length, ['воин', 'воина', 'воинов'])})`;
      break;
    }

    if (Math.random() * 100 >= hitChance2) {
      // Атака персонажа 2 успешна
      const damage2 = attacker2.strength * (Math.random() + 0.5);
      attacker1.armor -= damage2; // Уменьшаем броню цели
      if (attacker2.name === 'Эльф' && Math.random() * 100 < 10) {
        // Эльф успешно убил противника
        battleLog.innerHTML += `${attacker2.name} из войска 2 моментально убил юнита ${attacker1.name} из войска 1<br>`;
      } else if (attacker2.name === 'Колдун') {
        // Колдун переманивает противника
        attacker1.side = 'фракция 2';
        army2.push(attacker1);
        battleLog.innerHTML += `${attacker2.name} из войска 2 переманил юнита ${attacker1.name} из войска 1<br>`;
      }else if (attacker2.name === 'Кавалерия' && Math.random() * 100 < 10 && ( attacker1.name === 'Легкий орк'|| attacker1.name === "Тяжелый орк")) {
        // Кавалерия бежит
        battleLog.innerHTML += `${attacker1.name} из войска 2 пропускает ход из-за орка противника 2<br>`;
       } else {
        if (attacker1.armor <= 0) {
          // Если броня кончилась, персонаж умирает
          battleLog.innerHTML += `${attacker2.name} из войска 2 убил юнита ${attacker1.name} из войска 1<br>`;
        } else {
          battleLog.innerHTML += `${attacker2.name} из войска 2 атаковал юнита ${attacker1.name} из войска 1, у него осталось ${attacker1.armor.toFixed(2)} ед здоровья<br>`;
          army1.push(attacker1); // Персонаж 1 возвращается в армию
        }
      }
      await animateDamage(attacker2, attacker1, damage2, 0, battleLog);
    } else {
      // Атака персонажа 2 промахнулась
      battleLog.innerHTML += `${attacker2.name} из войска 2 промахнулся по юниту ${attacker1.name} из войска 1<br>`;
      army2.push(attacker2); // Персонаж 2 возвращается в армию
    }
    console.log('Первая армия - ' + army1.length + ' Раунд' + round);
    console.log('Вторая армия - ' + army2.length + ' Раунд' + round);
    if (army1.length === 0) {
      // Армия 1 уничтожена, армия 2 победила
      winnerElement.innerHTML = `Победители: Орки (${army2.length} ${declension(army2.length, ['воин', 'воина', 'воинов'])})`;
      break;
    }
    saveBattleLogToStorage();
    round++;
  }
}

// Функция для отрисовки человечка
function drawCharacter(name) {
  switch (name) {
    case "Колдун":
      return `
      <pre>
       _
      / \\ 
       0  Ж  -    ~%
      /Д\\_|  -- - ~%%
      /_\\ |    - ~%
      </pre>`;
  case "Пехотинец":
    return`
      <pre>
       _  
      |0| D     
     $[Ш]\\|
      T T '
      </pre>`;
  case "Эльф":
    return`
      <pre>
       \\O/ \\    
      \\/|\\__)   #-->
       ,^, /
       J L'
      </pre>`;
  case "Кавалерия":
    return`
      <pre>
          |    
          ⊥
        0/'      
       $|   №P
    ~^##/##//
      bb bb 
      </pre>`;
  case "Легкий орк":
    return `
      <pre>
       "@"     
      Я|||R   / 
     ./ | \\\.//
       / \\\  "
      |   |
      </pre>`;
  case "Тяжелый орк":
    return `
      <pre>
       _  
      "@"     
    _Я[|]R_   / 
  .// ||| \\\.//
     // \\\\   "
     || ||
      </pre>`;
      default:
      break;
    }
}

// Функция для анимации урона
function animateDamage(attacker, target, damage1, damage2, logElement) {
  return new Promise((resolve) => {
      setTimeout(() => {
          logElement.innerHTML += `
              <div class="damage-animation">
                  ${attacker.name} наносит ${damage1.toFixed(2)} урона ${target.name}
                  ${drawCharacter(attacker.name)}
              </div>
              `;
          resolve();
      }, 1000);
  });
}

// Функция для склонения слов
function declension(number, titles) {
  const cases = [2, 0, 1, 1, 1, 2];
  return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
}

// Вспомогательная функция для получения случайного персонажа из массива
function getRandomCharacterFromArray(arr) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

// Вспомогательная функция для получения случайного индекса
function getRandomIndex(arr) {
  return Math.floor(Math.random() * arr.length);
}

window.addEventListener('beforeunload', () => {
  // Сохраняем battleLog в sesssionStorage перед закрытием страницы
  saveBattleLogToStorage();
});