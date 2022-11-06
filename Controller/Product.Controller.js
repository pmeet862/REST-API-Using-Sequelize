const createError = require("http-errors");

const db = require("../Models");
const Product = db.product;

module.exports = {
  getAllProducts: async (req, res, next) => {
    try {
      const results = await Product.findAll({
        raw: true,
        attributes: ["id", "name", "price"],
      });
      res.send(results);
    } catch (error) {
      console.log(error.message);
    }
  },

  findProductByID: async (req, res, next) => {
    const id = req.params.id;
    try {
      const product = await Product.findOne({ where: { id: id }, raw: true });

      if (!product) {
        throw createError(404, "Product does not exist.");
      }
      res.send(product);
    } catch (error) {
      console.log(error.message);
      if (error instanceof mongoose.CastError) {
        next(createError(400, "Invalid product ID"));
        return;
      }
      next(error);
    }
  },

  createNewProduct: async (req, res, next) => {
    try {
      let product = await Product.create({
        name: req.body.name.trim(),
        price: req.body.price,
      });
      // console.log(product);
      product = product.toJSON();
      // console.log("after", product);
      res.redirect("/add-product");
    } catch (error) {
      console.log(error.message);
      if (error.name === "ValidationError") {
        next(createError(422, error.message));
        return;
      }
      next(error);
    }
    /*console.log(req.body);
        const product = new Product({
            name: req.body.name,
            price: req.body.price
        });
        product.save()
            .then(result => {
                console.log(result);
                res.send(result);
            })
            .catch(err => {
                console.log(err.message);
            });*/
  },

  updateProduct: async (req, res, next) => {
    try {
      const id = req.params.id;
      const updates = req.body;

      const result = await Product.update(updates, {
        where: { id: id },
        returning: true,
        raw: true,
      });
      if (!result) {
        throw createError(404, "Product does not exist.");
      }
      //console.log(result);
      res.send(result);
    } catch (error) {
      console.log(error.message);
      if (error instanceof mongoose.CastError) {
        next(createError(400, "Invalid product ID"));
        return;
      }
      next(error);
    }
  },

  deleteProduct: async (req, res, next) => {
    const id = req.params.id;
    try {
      const result = await Product.destroy({ where: { id: id } });
      if (!result) {
        throw createError(404, "Product does not exist.");
      }
      console.log(result);
      res.sendStatus(200);
    } catch (error) {
      console.log(error.message);
      // if (error instanceof mongoose.CastError) {
      //   next(createError(400, "Invalid product ID"));
      //   return;
      // }
      next(error);
    }
  },
};
