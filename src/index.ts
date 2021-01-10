require("dotenv").config();

import express, { Application } from "express";
import { uploadSalesRecord, viewSalesRecord } from './api'

const mount = async (app: Application) => {
  app.post('/sales/record', uploadSalesRecord)
  app.post('/sales/report', viewSalesRecord)

  app.listen(process.env.PORT);
  console.log(`[app] : http://localhost:${process.env.PORT}`);
}

mount(express());