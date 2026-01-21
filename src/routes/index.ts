// src/routes/index.ts
import { Router } from 'express';
import pool from '../database/mysql';

// ===== Repositories =====
import { DishRepositoryMysql } from '../database/repositories/DishRepositoryMysql';
import { TableRepository } from '../database/repositories/TableRepositoryMysql';
import { OrderRepositoryMysql } from '../database/repositories/OrderRepositoryMysql';
import { OrderitemRepositoryMysql } from '../database/repositories/OrderitemRepositoryMysql';
import { UserRepository } from '../database/repositories/UserRepositoryMysql';
import { TableReservationRepositoryMysql } from '../database/repositories/TableReservationRepositoryMysql';
import { WorkshiftsRepositoryMysql } from '../database/repositories/WorkshiftsRepositoryMysql';
import { ReportOrderRepositoryMysql } from '../database/repositories/ReportOrderRepositoryMysql';

// ===== Controllers =====
import { DishController } from '../controller/DishController';
import { TableController } from '../controller/TableController';
import { OrderController } from '../controller/OrderController';
import { OrderitemController } from '../controller/OrderitemController';
import { UserController } from '../controller/UserController';
import { TableReservationController } from '../controller/TableReservationController';
import { AuthController } from '../controller/AuthController';
import { OrderLocalController } from '../controller/OrderLocalController';
import { WorkshiftsController } from '../controller/WorkshiftsController';
import { ReportOrderController } from '../controller/ReportOrderController';

// ===== Use-cases =====
import { PlaceOrderLocal } from '../../Application/use-cases/order/PlaceOrderLocal';
import { GetOpenOrderByTable } from '../../Application/use-cases/order/GetOpenOrderByTable';
import { CheckoutOrder } from '../../Application/use-cases/order/CheckoutOrder';
import { HandleShift } from '../../Application/use-cases/user/HandleShift';

// ===== Security =====
import { BcryptEncrypter } from '../infrastructure/security/BcryptEncrypter';
import { JwtTokenGenerator } from '../infrastructure/security/JwtTokenGenerator';

import db from '../database/mysql';

const router = Router();

// =======================================================
// Repositories
// =======================================================
const dishRepository = new DishRepositoryMysql();
const tableRepository = new TableRepository();
const orderRepository = new OrderRepositoryMysql();
const orderitemRepository = new OrderitemRepositoryMysql();
const userRepository = new UserRepository();
const tableReservationRepository = new TableReservationRepositoryMysql();
const workshiftsRepository = new WorkshiftsRepositoryMysql();
const reportOrderRepository = new ReportOrderRepositoryMysql(pool);

// =======================================================
// Use-cases
// =======================================================
const checkoutOrder = new CheckoutOrder(
  orderRepository,
  tableRepository,
  orderitemRepository,
);
const handleShift = new HandleShift(userRepository, workshiftsRepository);
const placeOrderLocal = new PlaceOrderLocal(
  tableRepository,
  orderRepository,
  orderitemRepository,
  dishRepository,
  workshiftsRepository,
);

const getOpenOrderByTable = new GetOpenOrderByTable(
  orderRepository,
  orderitemRepository,
  dishRepository,
);

// =======================================================
// Controllers
// =======================================================
const dishController = new DishController(dishRepository);
const tableController = new TableController(tableRepository);
const orderitemController = new OrderitemController(
  orderitemRepository,
  userRepository,
);
const reportController = new ReportOrderController(reportOrderRepository);

// OrderController nhận thêm use-case lấy hóa đơn đang mở
const orderController = new OrderController(
  orderRepository,
  getOpenOrderByTable,
  checkoutOrder,
);

const userController = new UserController(userRepository);
const tableReservationController = new TableReservationController(
  tableReservationRepository,
);

const encrypter = new BcryptEncrypter();
const tokenGenerator = new JwtTokenGenerator(
  '031a50e4277bee0e1fb3041b40290446',
);
const authController = new AuthController(
  userRepository,
  encrypter,
  tokenGenerator,
);

const orderLocalController = new OrderLocalController(placeOrderLocal);

const workshiftsController = new WorkshiftsController(
  workshiftsRepository,
  handleShift,
);

// =======================================================
// Routes
// =======================================================

// Dish
router.post('/dishes', dishController.create);
router.put('/dishes/:id', dishController.update);
router.delete('/dishes/:id', dishController.delete);
router.get('/dishes', dishController.paginate);
router.get('/dishes/:id', dishController.findbyId);

// Order items
router.post('/orderitems', orderitemController.create);
router.put('/orderitems/:id', orderitemController.update);
router.delete('/orderitems/:id', orderitemController.delete);
router.get('/orderitems', orderitemController.paginate);
router.get('/orderitems/:id', orderitemController.findById);
router.post('/orderitems/cancel', orderitemController.cancel);

// Orders (CRUD)
router.post('/orders', orderController.create);
router.put('/orders/:id', orderController.update);
router.delete('/orders/:id', orderController.delete);
router.get('/orders', orderController.paginate);
router.get('/orders/:id', orderController.findById);

// LẤY HÓA ĐƠN ĐANG MỞ THEO BÀN (POS)
router.get('/orders/open-by-table/:tableId', orderController.getOpenByTable);

// Tables
router.post('/tables', tableController.create);
router.put('/tables/:id', tableController.update);
router.delete('/tables/:id', tableController.delete);
router.get('/tables', tableController.paginate);
router.get('/tables/:id', tableController.findById);

// Users
router.post('/users', userController.create);
router.put('/users/:id', userController.update);
router.delete('/users/:id', userController.delete);
router.get('/users', userController.paginate);
router.get('/users/:id', userController.findById);
router.get('/users/username/:username', userController.findByUsername);

// Table reservations
router.post('/table-reservations', tableReservationController.create);
router.put('/table-reservations/:id', tableReservationController.update);
router.delete('/table-reservations/:id', tableReservationController.delete);
router.get('/table-reservations', tableReservationController.paginate);
router.get('/table-reservations/:id', tableReservationController.findById);

// Workshifts (CRUD)
router.post('/workshifts', workshiftsController.create);
router.put('/workshifts/:id', workshiftsController.update);
router.delete('/workshifts/:id', workshiftsController.delete);
router.get('/workshifts', workshiftsController.paginate);
router.get('/workshifts/:id', workshiftsController.findById);

// Workshifts - Handle shift (check in/out)
router.post('/shift', workshiftsController.handle);

// Auth
router.post('/login', authController.login);

// POS – mở bàn + gọi món
router.post('/placeorderlocal', orderLocalController.placeOrder);

// POS – tính tiền
router.post('/orders/checkout', orderController.checkout);

//reports
router.get('/reports/revenue/range', reportController.revenueByRange);
router.get('/reports/menu', reportController.dishStatistic);
router.get('/reports/revenue/chart', reportController.revenueChart);

export default router;
