import { NextFunction, Request, Response } from "express"

export async function uploadSalesRecord (req: Request, res: Response, next: NextFunction) {
  
  res.json({ message: 'ok' })
}
