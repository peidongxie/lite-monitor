import { RoutingMethod, RoutingTable } from '../type/router';

/**
 * 路由表：路径，方法，路由
 */
export const ROUTING_TABLE: RoutingTable = {
  '/project': {
    [RoutingMethod.GET]: 'project/findProject',
    [RoutingMethod.POST]: 'project/addProject',
  },
  '/record': {
    [RoutingMethod.GET]: 'record/findRecord',
    [RoutingMethod.POST]: 'record/addRecord',
  },
};
