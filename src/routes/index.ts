// src/routes/index.ts
import { Router } from "express";

import { DishRepositoryMysql } from "../database/repositories/DishRepositoryMysql";
import { DishController } from "../controller/DishController";

import { TableRepository } from "../database/repositories/TableRepositoryMysql";
import { TableController } from "../controller/TableController";

import { OrderitemRepositoryMysql } from "../database/repositories/OrderitemRepositoryMysql";
import { OrderitemController } from "../controller/OrderitemController";

import { OrderController } from "../controller/OrderController";
import { OrderRepositoryMysql } from "../database/repositories/OrderRepositoryMysql";

import { UserRepository } from "../database/repositories/UserRepositoryMysql";
import { UserController } from "../controller/UserController";

import { TableReservationRepositoryMysql } from "../database/repositories/TableReservationRepositoryMysql";
import { TableReservationController } from "../controller/TableReservationController";

import { AuthController } from "../controller/AuthController";
import { BcryptEncrypter } from "../infrastructure/security/BcryptEncrypter";
import { JwtTokenGenerator } from "../infrastructure/security/JwtTokenGenerator";

import { OrderLocalController } from "../controller/OrderLocalController";

import { CalculateOrderController } from "../controller/CalculateOrderController";
import { WorkshiftsRepositoryMysql } from "../database/repositories/WorkshiftsRepositoryMysql";
import { WorkshiftsController } from "../controller/WorkshiftsController";

const router = Router();

// Infra implementation
const dishRepository = new DishRepositoryMysql();
const dishController = new DishController(dishRepository);

const orderitemRepository = new OrderitemRepositoryMysql();
const orderitemController = new OrderitemController(orderitemRepository);

const tableRepository = new TableRepository();
const tableController = new TableController(tableRepository);

const orderRepository = new OrderRepositoryMysql();
const orderController = new OrderController(orderRepository);

const userRepository = new UserRepository();
const userController = new UserController(userRepository);

const tableReservationRepository = new TableReservationRepositoryMysql();
const tableReservationController = new TableReservationController(tableReservationRepository);

const encrypter = new BcryptEncrypter()
const tokenGenerator = new JwtTokenGenerator('031a50e4277bee0e1fb3041b40290446')
const authController = new AuthController(
    userRepository,
    encrypter,
    tokenGenerator
)

const orderLocalController = new OrderLocalController(
    tableRepository,
    orderRepository,
    orderitemRepository,
    dishRepository
);

const calculateOrderController = new CalculateOrderController(
    tableRepository,
    orderRepository,
    orderitemRepository,
    dishRepository
);

const workshiftsRepository = new WorkshiftsRepositoryMysql();
const workshiftsController = new WorkshiftsController(workshiftsRepository, userRepository);

// Dish routes
router.post("/dishes", dishController.create);
router.put("/dishes/:id", dishController.update);
router.delete("/dishes/:id", dishController.delete);
router.get("/dishes", dishController.paginate);
router.get("/dishes/:id", dishController.findbyId);

// Orderitem routes
router.post("/orderitems", orderitemController.create);
router.put("/orderitems/:id", orderitemController.update);
router.delete("/orderitems/:id", orderitemController.delete);
router.get("/orderitems", orderitemController.paginate);
router.get("/orderitems/:id", orderitemController.findById);

// Order routes
router.post("/orders", orderController.create);
router.put("/orders/:id", orderController.update);
router.delete("/orders/:id", orderController.delete);
router.get("/orders", orderController.paginate);
router.get("/orders/:id", orderController.findById);

// Table routes
router.post("/tables", tableController.create);
router.put("/tables/:id", tableController.update);
router.delete("/tables/:id", tableController.delete);
router.get("/tables", tableController.paginate);
router.get("/tables/:id", tableController.findById);

// User routes
router.post("/users", userController.create);
router.put("/users/:id", userController.update);
router.delete("/users/:id", userController.delete);
router.get("/users", userController.paginate);

// Table Reservation routes
router.post("/table-reservations", tableReservationController.create);
router.put("/table-reservations/:id", tableReservationController.update);
router.delete("/table-reservations/:id", tableReservationController.delete);
router.get("/table-reservations", tableReservationController.paginate);
router.get("/table-reservations/:id", tableReservationController.findById);

// Auth routes
router.post("/login", authController.login)

// Place Order Local route
router.post("/placeorderlocal", orderLocalController.placeOrderLocal);

// Calculate Order Total route
router.post("/calculateordertotal", calculateOrderController.calculateOrderTotal);

// Workshifts routes
router.post("/workshifts/open", workshiftsController.openShift);
router.post("/workshifts/close", workshiftsController.closeShift);

export default router;