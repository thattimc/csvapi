require("dotenv").config();

import express, { Application } from "express";

import { uploadSalesRecord } from './api'

const mount = async (app: Application) => {
  app.get('/sales/record', uploadSalesRecord)

  app.listen(process.env.PORT);
  console.log(`[app] : http://localhost:${process.env.PORT}`);
}

mount(express());