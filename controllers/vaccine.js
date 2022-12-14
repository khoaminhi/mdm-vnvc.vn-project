const vaccineModel = require('../models/vaccine')

function VaccineController() {
    const SELF = {
    };
    return {
        index: async (req, res, next) => {
            try {
                let vaccines = await vaccineModel.find();
                res.render('vaccineList', { vaccines });
            } catch (error) {
                return res.status(400).json(error);
            }
        },
        add: async (req, res, next) => {
            try {
                let vaccine = new vaccineModel(req.body);
                await vaccine.save()
                return res.status(200).json({
                    status: "Success"
                })
            } catch (error) {
                return res.status(400).json(error);
            }
        },
        getByType: async (req, res, next) => {
            try {
                let type = req.params.type;
                let vaccines = await vaccineModel.find({ type: type })
                return res.status(200).json(vaccines)
            } catch (error) {
                return res.status(400).json(error);
            }
        },
        renderByType: async (req, res, next) => {
            try {
                let type = req.params.type;
                let vaccines = await vaccineModel.find({ type: type })
                res.render('vaccineList', { vaccines })
            } catch (error) {
                return res.status(400).json(error);
            }
        },
        manageVaccines: async (req, res, next) => {
            try {
                let vaccines = await vaccineModel.find();
                res.render('vaccines/manageVaccine', { vaccines });
            } catch (error) {
                return res.status(400).json(error);
            }
        },
        deleteVaccine: async (req, res, next) => {
            try {
                //at here I use delete not remove because my team is codeing other way
                // which I don't know that will be happen. Should be set isArchive attribute is true
                // that will increase beformance
                if(!req.params.id) return es.send({success: false, notice: `?????u v??o kh??ng c?? m??. ${req.params.id}`});
                let result = await vaccineModel.findOneAndDelete({_id:req.params.id}).lean();
                if(result) return res.send({success: true, notice: `X??a th??nh c??ng v??c xin c?? m??: ${req.params.id}`});
                return res.send({success: false, notice: `X??a th???t b???i v??c xin c?? m??: ${req.params.id}`});
            } catch (error) {
                return res.status(400).json(error);
            }
        },
        getVaccineDetail: async (req, res, next) => {
            try {
                let vaccine = await vaccineModel.findById({ _id: req.params.id }).lean();
                res.render('vaccines/updateVaccine', { vaccine });
            } catch (error) {
                return res.status(400).json(error);
            }
        },
        updateVaccine: async (req, res, next) => {
            try {
                if(!(req.params.id && req.body.name && req.body.price && req.body.inventory_number
                    && req.body.desc)
                ) return res.render("vaccines/updateVaccine", { notice: "???? c?? m???t ?? nh???p tr???ng. Vui l??ng ki???m tra l???i! M??:" + req.params.id }); 
                let vaccine = await vaccineModel.findOneAndUpdate(
                    { _id: req.params.id },
                    {
                        name: req.body.name,
                        price: req.body.price,
                        inventory_number: req.body.inventory_number,
                        desc: req.body.desc,
                    },
                    {
                        new: true,
                    }
                ).lean();
                if (!vaccine) return res.render("vaccines/updateVaccine",
                    { notice: "C???p nh???t v??c xin th???t b???i! Vui l??ng gi??? nguy??n hi???n tr?????ng v?? b??o ban it@" });
                
                res.redirect('/vaccine/' + req.params.id);
            } catch (error) {
                console.log(error);
                return res.status(400).json(error);
            }
        },
    };
}

module.exports = new VaccineController();
