import { NextFunction, Request, Response } from "express";
import { VerifyErrors } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import UserSchema from '../mongoose_model/User';
import { CallbackError, Document } from "mongoose";

export default function JWT(req: any, res: Response<any>, next: NextFunction) {

    const secret = process.env.SECRET || 'somesecretkey';
    const { ID } = req.cookies;
    if (ID) {
        jwt.verify(ID, secret, (err: VerifyErrors | null, decoded: any) => {
            if (err) {
                res.status(401);
                if (err.name === 'JsonWebTokenError') {
                    res.json({
                        error: 'Invalid Key'
                    });
                } else {
                    res.json({
                        error: 'Key Expired'
                    });
                }
            } else {
                const id: string = decoded?.id || '';

                UserSchema.findById(id, (err: CallbackError, user: Document<any>) => {
                    if (err || !user) {
                        res.status(401);
                        res.json({
                            error: 'Unauthorised'
                        })
                    } else {
                        req.user = user;
                        next();
                    }
                });
            }
        });
    } else {
        res.status(401);
        res.json({
            error: 'Key Not Found'
        });
    }
}