import { IOrderitemRepository } from '../../../Entities/Orderitem/IOrderitemRepository';
import { IUserRepository } from '../../../Entities/User/IUserRepository';

interface CancelOrderItemInput {
  orderItemId: number;
  reason: string;
  username: string;
  password: string;
}

export const cancelOrderItemService = async (
  input: { orderItemId: number; reason: string },
  deps: {
    orderitemRepository: IOrderitemRepository;
  },
) => {
  const { orderItemId, reason } = input;
  const { orderitemRepository } = deps;

  if (!orderItemId || !reason) {
    throw new Error('MISSING_DATA');
  }

  const orderitem = await orderitemRepository.findById(orderItemId);
  if (!orderitem) {
    throw new Error('ORDERITEM_NOT_FOUND');
  }

  // ⏳ Chuyển sang trạng thái chờ admin duyệt
  return orderitemRepository.update({
    id: orderItemId,
    status: 'cancelled',
    cancelReason: reason,
  });
};
