// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
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
    title: '學員管理',
    path: '/dashboard/studentManage',
    icon: icon('ic_disabled'),
  },
  {
    title: '學員紀錄',
    path: '/dashboard/studentLog',
    icon: icon('ic_disabled'),
  },
  {
    title: '句子管理',
    path: '/dashboard/sentence',
    icon: icon('ic_disabled'),
  },
  {
    title: '類型管理',
    path: '/dashboard/kind',
    icon: icon('ic_disabled'),
  },
  {
    title: '遊戲管理',
    path: '/dashboard/gameManage',
    icon: icon('ic_disabled'),
  },
  {
    title: '分數管理',
    path: '/dashboard/testPoint',
    icon: icon('ic_disabled'),
  },
];

export default navConfig;
