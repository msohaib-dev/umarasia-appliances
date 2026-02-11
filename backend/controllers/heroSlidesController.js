const heroSlidesService = require("../services/heroSlidesService");

const getHeroSlides = async (_req, res, next) => {
  try {
    const data = await heroSlidesService.getHeroSlides();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getHeroSlides
};
