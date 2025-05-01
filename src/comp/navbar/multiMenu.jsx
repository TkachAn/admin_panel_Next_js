//src/comp/navbar/multiMenu.js
const menuItemsW = [
  { 
    label: 'Главная', 
    children: [
      { label: 'на главную', href: '/' },
      { label: 'Участки', href: '/pages/plots' },
      { label: 'Владельцы', href: '/pages/owners' },
      { label: 'Счётчики', href: '/counters' },
      { label: 'Хронология участков', href: '/pages/history' },
  ], 
},
  {
    label: 'Добавить',
    children: [
      { label: 'новый участок', href: '/add/plot' },
      { label: 'нового владельца', href: '/add/owner' },
      { label: 'новый счётчик', href: '/add/counter' },
      { label: 'показания счётчиков', href: '/add/reading' },
      { label: 'новый пользователь', href: '/add/user' },
    ],
  },
  {
    label: 'Админпанель',
    children: [
      { label: 'Админпанель', href: '/admin' },
      {
        label: 'Инструкции',
        children: [
          { label: 'для админа', href: '/admin/instructions/forAdmin' },
          { label: 'для бухгалтера', href: '/admin/instructions/forBooker' },
          { label: 'для инспектора', href: '/admin/instructions/forInspector' },
          { label: 'ТЕСТ', href: '/errors' },
        ],
      },
    ],
  },
  { label: 'ВЫХОД', href: '/auth' },
];

export default menuItemsW;