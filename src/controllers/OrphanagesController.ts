/**
 * Orphanage Controller
 */
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import Orphanage from '../models/Orphanage';
import orphanageView from '../views/orphanages_view';
import * as Yup from 'yup';

export default {
    async index(request: Request, response: Response) {

        const orphanageRepository = getRepository(Orphanage);

        const orphanages = await orphanageRepository.find({
            relations: ['images']
        });

        return response.json(orphanageView.renderMany(orphanages));
    },
    async create(request: Request, response: Response) {
        
        const {
            name,
            latitude,
            longitude,
            instructions,
            about,
            opening_hours,
            open_on_weekends
        } = request.body;
    
        // array de imagens
        const requestImages = request.files as Express.Multer.File[];
        const images = requestImages.map(image => {
            return {path: image.filename}
        });

        const orphanageRepository = getRepository(Orphanage);
    
        const data = {
            name,
            latitude,
            longitude,
            instructions,
            about,
            opening_hours,
            open_on_weekends,
            images
        };

        // validacao dos dados
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            latitude: Yup.number().required(),
            longitude: Yup.number().required(),
            instructions: Yup.string().required(),
            about: Yup.string().required().max(300),
            opening_hours: Yup.string().required(),
            open_on_weekends: Yup.boolean().required(),
            images: Yup.array(
                Yup.object().shape({
                    path: Yup.string().required(),
                })
            )
        });

        await schema.validate(data, { abortEarly: false });

        // criacao do registro
        const orphanage = orphanageRepository.create(data);
    
        await orphanageRepository.save(orphanage);
        
        return response.status(201).json(orphanage);
    },
    async show(request: Request, response: Response) {

        const { id } = request.params;
        
        const orphanageRepository = getRepository(Orphanage);

        const orphanage = await orphanageRepository.findOneOrFail(id, {
            relations: ['images']
        });

        return response.json(orphanageView.render(orphanage));
    }
};