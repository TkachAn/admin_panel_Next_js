//src/comp/navbar/multiMenu.js
const menuItemsW = [
  { 
    label: 'Главная', 
    children: [
      { label: 'Главная', href: '/' },
      { label: 'для админа', href: '/admin/instructions/forAdmin' },
      { label: 'для бухгалтера', href: '/admin/instructions/forBooker' },
      { label: 'для инспектора', href: '/admin/instructions/forInspector' },
  ], 
},
  {
    label: 'Добавить',
    children: [
      { label: 'новый участок', href: '/plots' },
      { label: 'нового владельца', href: '/owners' },
      { label: 'новый счётчик', href: '/counters' },
      { label: 'показания счётчиков', href: '/his' },
    ],
  },
  {
    label: 'Админпанель',
    children: [
      { label: 'Админпанель', href: '/admin' },
      {
        label: 'Панель',
        children: [
          { label: 'Админпанель', href: '/admin' },
        ],
      },
      {
        label: 'Инструкции',
        children: [
          { label: 'для админа', href: '/admin/instructions/forAdmin' },
          { label: 'для бухгалтера', href: '/admin/instructions/forBooker' },
          { label: 'для инспектора', href: '/admin/instructions/forInspector' },
        ],
      },
    ],
  },
  { label: 'ВЫХОД', href: '/auth' },
];

export default menuItemsW;