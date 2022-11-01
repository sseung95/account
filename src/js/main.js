import Swiper from 'https://unpkg.com/swiper@8/swiper-bundle.esm.browser.min.js';

const swiper = new Swiper('.swiper', {});
const upBtns = document.querySelectorAll('.up-btn');
let upStatus = false;

// TODO: json data fetch로 가져오기
const accountObj = {
  name: '생활비',
  accountNumber: '355-673877-78773',
  balance: 2240000,
  banks: [
    {
      title: '여행가자!',
      balance: 842200,
    },
    {
      title: '냉장고사기',
      balance: 142200,
    },
  ],
  expenses: [
    {
      date: '2022.5.1',
      inOut: 'in',
      type: 'mart',
      item: '용돈',
      price: 20000,
    },
    {
      date: '2022.5.1',
      inOut: 'out',
      type: 'health',
      item: '샐러드',
      price: 10000,
    },
    {
      date: '2022.5.1',
      inOut: 'out',
      type: 'eatout',
      item: '맛있어돈까스',
      price: 8000,
    },
    {
      date: '2022.5.1',
      inOut: 'out',
      type: 'mart',
      item: '이마트',
      price: 36000,
    },
    {
      date: '2022.5.1',
      inOut: 'out',
      type: 'eatout',
      item: '놀부보쌈',
      price: 1200,
    },
    {
      date: '2022.5.2',
      inOut: 'in',
      type: 'mart',
      item: '김밥천국',
      price: 10000,
    },
    {
      date: '2022.5.2',
      inOut: 'out',
      type: 'mart',
      item: '쌈밤',
      price: 20000,
    },
    {
      date: '2022.5.2',
      inOut: 'out',
      type: 'mart',
      item: '콜라',
      price: null,
    },
    {
      date: '2022.5.2',
      inOut: 'out',
      type: 'eatout',
      item: '택시',
      price: 30000,
    },
    {
      date: '2022.5.3',
      inOut: 'out',
      type: 'eatout',
      item: '짜장면',
      price: 29900,
    },
    {
      date: '2022.5.8',
      inOut: 'out',
      type: 'mart',
      item: '콜라',
      price: 1234,
    },
    {
      date: '2022.5.8',
      inOut: 'out',
      type: 'mart',
      item: '콜라',
      price: 1234,
    },
    {
      date: '2022.5.9',
      inOut: 'out',
      type: 'mart',
      item: '콜라',
      price: 1234,
    },
    {
      date: '2022.5.9',
      inOut: 'out',
      type: 'eatout',
      item: '택시',
      price: 30000,
    },
    {
      date: '2022.5.10',
      inOut: 'out',
      type: 'eatout',
      item: '짜장면',
      price: 29900,
    },
    {
      date: '2022.5.10',
      inOut: 'out',
      type: 'eatout',
      item: '짜장면',
      price: 29900,
    },
    {
      date: '2022.5.10',
      inOut: 'out',
      type: 'eatout',
      item: '짜장면',
      price: 29900,
    },
  ],
};

const initialMousePos = { x: 0, y: 0 }; // 드래그 시작점 마우스 포인터 위치
const offset = { x: 0, y: 0 }; // 이동할 거리

////////////////////////////////////////
// 이벤트
////////////////////////////////////////
upBtns.forEach((upBtn) => {
  upBtn.addEventListener('mousedown', (e) => {
    // 계좌가 여러개이므로 해당 계좌 내에서 요소를 찾기위해서..?

    // 1. 마우스 클릭하면 드래그 시작점 마우스 포인터 위치를 잡는다.
    initialMousePos.x = e.clientX;
    initialMousePos.y = e.clientY;

    // 이벤트
    document.addEventListener('mousemove', moveHistory);
  });

  // 마우스를 떼면 mousemove 이벤트 제거
  document.addEventListener('mouseup', () => {
    document.removeEventListener('mousemove', moveHistory);
  });
});

////////////////////////////////////////
// 함수
////////////////////////////////////////
function moveHistory(e) {
  const accountHistory = document.querySelector('.account-history');

  // 2. 마우스가 움직이면 드래그 시작점과 현재 마우스 포인터 위치를 비교한다.
  offset.x = e.clientX - initialMousePos.x;
  offset.y = e.clientY - initialMousePos.y;

  // 3. 드래그 시작점 - 현재 마우스 포인터 위치 -> 이동거리를 계산하여 transform 해준다.
  accountHistory.style.transform = `translateY(${offset.y}px)`;
}

function createExpenseEl(dataArr, daysAgo = 0) {
  const targetArr = dataArr.filter((data) => data.date === getDate(-daysAgo));

  // 해당하는 날짜의 데이터 없으면 중단
  if (targetArr.length === 0) return;

  // 총 지출금액 계산
  const totalPrice = targetArr.reduce(
    (prev, curr) =>
      curr.inOut === 'in' ? prev + curr.price : prev - curr.price,
    0
  );

  // 엘리먼트 생성
  const expense = document.createElement('div');
  const expenseHeader = document.createElement('div');
  const expenseDate = document.createElement('span');
  const expenseTotal = document.createElement('span');
  const expenseList = document.createElement('ul');

  // 클래스명 추가
  expense.classList.add('expense');
  expenseHeader.classList.add('expense__header');
  expenseDate.classList.add('expense__date');
  expenseTotal.classList.add('expense__total');
  expenseList.classList.add('expense__list');

  // 텍스트 추가
  expenseTotal.textContent = `${(-totalPrice).toLocaleString()}원 지출`;
  expenseDate.textContent = getDate(-daysAgo);

  if (daysAgo === 0) expenseDate.textContent = '오늘';
  if (daysAgo === 1) expenseDate.textContent = '어제';
  if (daysAgo >= 2 && daysAgo <= 7) expenseDate.textContent = `${daysAgo}일전`;

  // expense 리스트 아이템 하나씩 추가해주기
  targetArr.forEach((item) => {
    // 엘리먼트 생성
    const expenseItem = document.createElement('li');
    const name = document.createElement('span');
    const price = document.createElement('span');

    // 클래스명 추가
    expenseItem.classList.add('expense__item');
    name.classList.add('expense__name');
    price.classList.add('expense__price');

    if (item.inOut === 'in') {
      price.classList.add('income');
    }

    // 텍스트 추가
    name.textContent = item.item;
    price.textContent =
      item.inOut === 'in'
        ? `+ ${item.price.toLocaleString()}`
        : item.price?.toLocaleString();

    // 엘리먼트 삽입
    expenseItem.appendChild(name);
    expenseItem.appendChild(price);
    expenseList.appendChild(expenseItem);
  });

  // 엘리먼트 삽입
  expenseHeader.appendChild(expenseDate);
  expenseHeader.appendChild(expenseTotal);
  expense.appendChild(expenseHeader);
  expense.appendChild(expenseList);

  return expense;
}

function createBank(bankObj) {
  const bank = document.createElement('li');
  const title = document.createElement('div');
  const balance = document.createElement('div');

  bank.classList.add('bank');
  title.classList.add('bank__title');
  balance.classList.add('bank__balance');

  title.textContent = bankObj.title;
  balance.textContent = bankObj.balance.toLocaleString();

  bank.appendChild(title);
  bank.appendChild(balance);
  return bank;
}

function getDate(day) {
  const now = new Date();
  const date = new Date(now.setDate(now.getDate() + day));
  return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
}

function renderAccount(accountObj) {
  const accountTitle = document.querySelector('.header__title');
  const accountNumber = document.querySelector('.account-info__number');
  const accountBalance = document.querySelector('.account-info__balance');
  const banks = document.querySelector('.banks');
  const expenseCover = document.querySelector('.expense-cover');

  accountTitle.textContent = accountObj.name;
  accountNumber.textContent = accountObj.accountNumber;
  accountBalance.textContent = accountObj.balance.toLocaleString();

  // 저금통 추가
  accountObj.banks.forEach((bank) => {
    const bankEl = createBank(bank);
    banks.prepend(bankEl);
  });

  // 한달 히스토리
  for (let i = 0; i <= 30; i++) {
    const expense = createExpenseEl(accountObj.expenses, i);
    if (expense) {
      expenseCover.appendChild(expense);
    }
  }
}

renderAccount(accountObj);
