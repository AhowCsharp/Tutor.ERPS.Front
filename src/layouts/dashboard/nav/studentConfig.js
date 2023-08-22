// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navStudentConfig = [
  {
    title: 'dashboard',
    path: '/student/app',
    icon: icon('ic_analytics'),
  },
  // {
  //   title: 'user',
  //   path: '/dashboard/user',
  //   icon: icon('ic_user'),
  // },
  // {
  //   title: 'product',
  //   path: '/dashboard/products',
  //   icon: icon('ic_cart'),
  // },
  // {
  //   title: 'blog',
  //   path: '/dashboard/blog',
  //   icon: icon('ic_blog'),
  // },
  // {
  //   title: 'login',
  //   path: '/login',
  //   icon: icon('ic_lock'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic_disabled'),
  // },
  {
    title: '學員測試',
    path: '/student/test',
    icon: icon('ic_disabled'),
  },
  {
    title: '學習紀錄',
    path: '/student/log',
    icon: icon('ic_disabled'),
  },
  {
    title: '單字遊戲',
    path: '/student/game',
    icon: icon('ic_disabled'),
  }
];

export default navStudentConfig;
