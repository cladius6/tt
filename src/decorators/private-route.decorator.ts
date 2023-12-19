import { SetMetadata } from '@nestjs/common';

export const IS_PRIVATE_ROUTE_KEY = 'isPrivateRoute';
export const PrivateRoute = () => SetMetadata(IS_PRIVATE_ROUTE_KEY, true);