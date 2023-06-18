import type { Request, Response } from 'express';
import { Reaction } from '../models/reaction';
import { errorMessage } from '../../utils/messageHelper';
import { MESSAGE } from '../constants/message';

export const reactionCreate = async (req: Request, res: Response) => {
  try {
    const reaction = await Reaction.create(req.body);
    return res.status(201).json(reaction.dataValues);
  } catch (error) {
    return res.status(500).json(errorMessage(error));
  }
};

export const reactionUpdate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const reactionUpdated = await Reaction.update(req.body, {
      where: { id },
    });

    if (reactionUpdated) {
      const reaction = await Reaction.findByPk(id);
      return res.status(200).json(reaction);
    }

    return res.status(500).json(errorMessage(MESSAGE.FAILED_UPDATE));
  } catch (error) {
    return res.status(500).json(errorMessage(error));
  }
};

export const reactionDelete = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const reaction = await Reaction.findByPk(id);

    if (!reaction) {
      return res.status(404).json(errorMessage(MESSAGE.RECORD_NOT_FOUND));
    }

    await reaction.destroy();

    return res.status(200).json(reaction);
  } catch (error) {
    return res.status(500).json(errorMessage(error));
  }
};
