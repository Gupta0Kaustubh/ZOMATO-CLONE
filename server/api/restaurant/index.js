import { express } from "express";

import { RestaurantModel } from "../../database/allModels";

const Router = express.Router();

/*
    Route   /
    Desc    Get all the restaurant detils based on the city
    params  none
    Access  Public
    Method  GET
*/
Router.get("/", async (req, res) => {
    try {
        // http://localhost:400/restaurant/?city=hospet
        const { city } = req.query;
        const restaurants = await RestaurantModel.find({ city });
        if (restaurants.length === 0) {
            return res.json({ error: "No restaurant found in this city" });
        }
        return res.json({ restaurants });
    } catch (error) {
        return res.status(500).json({ error: error.message });
   } 
});

/*
    Route   /:_id
    Desc    Get individual restaurant detils based on the id
    params  _id
    Access  Public
    Method  GET
*/
Router.get("/:_id", async (req, res) => {
    try {
        const { _id } = req.params;
        const restaurants = await RestaurantModel.findById(_id);
        if (!restaurants) {
            return res.status(400).json({ error: "Restaurant Not Found !!!" });
        }
        return res.json({ restaurants });
    } catch (error) {
        return res.status(500).json({ error: error.message });
   } 
});

/*
    Route   /search/:searchString
    Desc    Get restaurant detils based on search string
    params  searchString
    Access  Public
    Method  GET
*/
Router.get("/search/:searchString", async (req, res) => {
    try {
        const { searchString } = req.params;
        const restaurants = await RestaurantModel.find({
            name: {$regex: searchString, $options: "i"},
        })
        if (restaurants.length === 0) {
            return res.status(400).json({ error: `No restaurant matched with ${searchString}` });
        }
        return res.json({ restaurants });
    } catch (error) {
        return res.status(500).json({ error: error.message });
   } 
});

export default Router;