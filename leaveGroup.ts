import { Request, Response } from 'express';

import { user } from '../../app';

export async function leaveGroup(req: Request, res: Response) {

    const {group} = req.body

    try{
        await user
            .leaveGroup(group)
            .then((result) => {
                console.log('Result: ', result); //return object success
            })
            .catch((erro) => {
                console.error('Error when leaving: ', erro); //return object error
            });
        
        res.status(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}
