// tạo oder(tại quán) => in (oderitem(dish,quatiti,note) , tableid ) out(oder)
// cập nhật table => tạo oderitem(status "chưa lên món"),=>oder (đang phục vụ)
import { ITableRepository } from "../../../Entities/Table/ITableRepository"
import { IOrderitemRepository } from "../../../Entities/Orderitem/IOrderitemRepository"
import { IOrderRepository } from "../../../Entities/Order/IOrderRepository"
import { IDishRepository } from "../../../Entities/Dish/IDishRepository"
import { Order } from "../../../Entities/Order/Order"

interface PlaceOrderItemData {
    dish_id: number
    quantity: number
    note: string
}

interface PlaceOrderData {
    items: PlaceOrderItemData[]
    table_id: number
}

export class PlaceOrderLocal {
    constructor(
        private readonly tableRepository: ITableRepository,
        private readonly orderItemRepository: IOrderitemRepository,
        private readonly orderRepository: IOrderRepository,
        private readonly dishRepository: IDishRepository
    ){}

    async execute(data: PlaceOrderData): Promise<Order> {
        const table = await this.tableRepository.findById(data.table_id)
        if (!table) {
            throw new Error("Table not found")
        }
        await this.tableRepository.update({
            id: data.table_id,
            status: 'close'
        })

        const order = await this.orderRepository.create({
            tableId: data.table_id,
            status: 'open',
        })

        for (const element of data.items) {
            const item = element

            const dish = await this.dishRepository.findById(item.dish_id)
            if (!dish) {
                throw new Error(`Dish with id ${item.dish_id} not found`)
            }

            await this.orderItemRepository.create({
                order: order.id,
                dish: item.dish_id,
                quantity: item.quantity,
                note: item.note,
                price: dish.price,
                status: 'pending'
            })
        }

        return order
    }
}