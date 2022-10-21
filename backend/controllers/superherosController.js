const uuid = require('uuid');
const path = require('path');
const fs = require('fs');
const { Superhero, Photo, Superpower, SuperheroSuperpower } = require('../models/models');
const APIError = require('../error/APIError');

class SuperherosController {
  async create(req, res, next) {
    try {
      const { 
        nickname,
        real_name,
        origin_description,
        catch_phrase,
      } = req.body;
      const superpowers = JSON.parse(req.body.superpowers);

      const images = req.files;
  
      const superhero = await Superhero.create({
        nickname,
        real_name,
        origin_description,
        catch_phrase,
      });

      for (let img_key in images) {
        const img = images[img_key];
        let filename = uuid.v4() + '.jpg';
        img.mv(path.resolve(__dirname, '..', 'static', filename));

        Photo.create({
          filename,
          superheroId: superhero.id,
        });
      }

      for (let superpower_name of superpowers) {
        const [superpower] = await Superpower.findOrCreate({
          where: { name: superpower_name },
          defaults: {
            name: superpower_name
          }
        });

        SuperheroSuperpower.create({
          superheroId: superhero.id,
          superpowerId: superpower.id,
        });
      }
      
      return res.json(superhero);
    } catch (err) {
      next(APIError.badRequest(err.message));
    }
  }

  async getAll(req, res) {
    const superheros = await Superhero.findAll();

    return res.json(superheros);
  }

  async getChunk(req, res) {
    let { limit, page } = req.query;
    page = page || 1;
    limit = limit || 5;
    let offset = limit * (page - 1);

    const superheros = await Superhero.findAndCountAll({
      limit, 
      offset, 
      distinct: true, 
      include: [{ model: Superpower }, { model: Photo }],
      order: [ [ 'createdAt', 'DESC' ]],
    });

    superheros.rows = superheros.rows.map(superhero => {
      superhero.Superpowers = superhero.Superpowers.map(sp => ({id: sp.id, name: sp.name}));
      superhero.Photos = superhero.Photos.map(p => p.filename)[0];
      return ({
        id: superhero.id,
        nickname: superhero.nickname,
        //real_name: superhero.real_name,
        origin_description: superhero.origin_description,
        //catch_phrase: superhero.catch_phrase,
        //superpowers: superhero.Superpowers,
        photo: superhero.Photos
      });
    });

    return res.json(superheros);
  }

  async getOne(req, res) {
    const { superheroId } = req.params;
    const superhero = await Superhero.findOne({
      where: { 
        id: superheroId
      },
      include: [{ model: Superpower }, { model: Photo }]
    });

    let {
      id,
      nickname,
      real_name,
      origin_description,
      catch_phrase,
      Superpowers: superpowers,
      Photos: photos,
    } = superhero;

    superpowers = superpowers.map(sp => ({ id: sp.id, name: sp.name }));
    photos = photos.map(p => ({ id: p.id, filename: p.filename }));

    return res.json({
      id,
      nickname,
      real_name,
      origin_description,
      catch_phrase,
      superpowers,
      photos,
    });
  }

  async delete(req, res) {
    const { superheroId } = req.params;

    const superhero = await Superhero.destroy({
      where: {
        id: superheroId
      }
    });

    return res.json(superhero);
  }

  async change(req, res, next) {
    try {
      const { superheroId } = req.params;

      const { 
        nickname,
        real_name,
        origin_description,
        catch_phrase,
      } = req.body;
      const superpowers = JSON.parse(req.body.superpowers);
      const removed_images = JSON.parse(req.body.removed_images);

      const images = req.files;
  
      const superhero = await Superhero.update({
        nickname,
        real_name,
        origin_description,
        catch_phrase,
      }, { where: { id: superheroId } });

      for (let img_key in images) {
        const img = images[img_key];
        let filename = uuid.v4() + '.jpg';
        img.mv(path.resolve(__dirname, '..', 'static', filename));

        Photo.create({
          filename,
          superheroId,
        });
      }

      for (let image of removed_images) {
        Photo.destroy({
          where: {
            filename: image,
          }
        });
        try {
          fs.unlinkSync(path.resolve(__dirname, '..', 'static', image));
        } catch (err) {
          console.log(`File ${image} was not deleted!`);
        }
      }

      const updated_superhero = await Superhero.findOne({
        where: { id: superheroId }, include: [{ model: Superpower }]
      });
      
      const superpowers_list = updated_superhero.dataValues.Superpowers.map(
        superpower => [superpower.dataValues.id, superpower.dataValues.name]
      );
      const superpowers_list_names = superpowers_list.map(
        superpower => superpower[1]
      );
      
      const deleted_superpowers = superpowers_list.filter(([, superpower]) => !superpowers.includes(superpower));
      const added_superpowers = superpowers.filter((superpower) => !superpowers_list_names.includes(superpower));

      for (let [superpower_id, superpower_name] of deleted_superpowers) {
        SuperheroSuperpower.destroy({
          where: {
            superheroId,
            superpowerId: superpower_id
          }
        });
      }

      for (let superpower_name of added_superpowers) {
        const [superpower] = await Superpower.findOrCreate({
          where: { name: superpower_name },
          defaults: {
            name: superpower_name
          }
        });

        SuperheroSuperpower.create({
          superheroId,
          superpowerId: superpower.id,
        });
      }
      
      return res.json(superhero);
    } catch (err) {
      next(APIError.badRequest(err.message));
    }
  }
}

module.exports = new SuperherosController();
