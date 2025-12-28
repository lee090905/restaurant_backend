import { createContainer, asClass, asValue, asFunction, InjectionMode } from "awilix";
import { DishRepositoryMysql } from "./database/repositories/DishRepositoryMysql";

export function buildContainer() {
  const container = createContainer({
    injectionMode: InjectionMode.CLASSIC
  })

  container.register({
    dishRepository: asClass(DishRepositoryMysql).scoped(),

  })

  return container
}

