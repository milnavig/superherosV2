const sequelize = require('../db');

const { DataTypes } = require('sequelize');

const Superhero = sequelize.define('Superhero', {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
  },
  nickname: {
    type: DataTypes.STRING, unique: true, allowNull: false
  },
  real_name: {
    type: DataTypes.STRING, allowNull: false
  },
  origin_description: {
    type: DataTypes.TEXT
  },
  catch_phrase: {
    type: DataTypes.TEXT
  },
});

const Superpower = sequelize.define('Superpower', {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
  },
  name: {
    type: DataTypes.STRING, unique: true, allowNull: false
  },
});

const Photo = sequelize.define('Photo', {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
  },
  filename: {
    type: DataTypes.STRING, unique: true, allowNull: false
  },
});

const SuperheroSuperpower = sequelize.define('SuperheroSuperpower', {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
  },
});

Superhero.hasMany(Photo, { foreignKey: 'superheroId', onDelete: 'cascade', hooks: true });
Photo.belongsTo(Superhero, { foreignKey: 'superheroId', });

Superhero.belongsToMany(Superpower, { through: SuperheroSuperpower, foreignKey: "superheroId", });
Superpower.belongsToMany(Superhero, { through: SuperheroSuperpower, foreignKey: "superpowerId", });

module.exports = {
  Superhero,
  Superpower,
  Photo,
  SuperheroSuperpower,
}
