const { validate, postSchema, customerSchema, } = require("../shared/schema");
const Helper = require("../helpers/customer.helper");
const { resolveContent } = require("nodemailer/lib/shared");
const { users } = require("../shared/mongo");



module.exports = {
    async getAll(req, res) {
        try {
            const customers = await Helper.findAll();
            res.json(customers);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "error fetching customers" })
        }

    },

    async getById(req, res) {
        try {
            const customer = await Helper.findById(req.params.id);
            if (!customer) {
                res.status(401).json({ message: "following customer doest not exists" })
            }

            res.json(customer);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "error fetching customer" })
        }
    },

    async create(req, res) {
        try {
            const isError = await validate(customerSchema, req.body)
            if (isError) return res.status(400).json({ error: isError });
        
          const role={
              role:"admin",
              role:"manager"
          }
            if (!role){
                return res.status(401).json({ messsage: "no authorization to perform this action" });
            }
            //insert into posts collection
            const { insertedId } = await Helper.insert({ ...req.body, userId: req.user._id })

            const customer = await Helper.findById(insertedId);
            res.json({ message: "customer is successfully created!!", customer })

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "error while creating customer" })
        }


    },

    async update(req, res) {
        try {
            const isError = await validate(postSchema, req.body)
            if (isError) return res.status(400).json({ error: isError });

            // post exist or not
            let post = await Helper.findById(req.params.id)
            if (!post)
                return res.status(401).json({ messsage: "customer doesnt exists" });

            if (post.userId != req.user._id)
                return res.status(401).json({ messsage: "user is not authorized to this opertaion" });

            //update into posts collection
            const { value } = await Helper.updateById(req.params.id, req.body);
            res.json({ message: "customer updated successfully", post: value })

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "error while updating" })
        }

    },

    

    async remove(req, res) {
        try {


            // post exist or not
            const post = await Helper.findById(req.params.id)
            if (!post)
                return res.json(401).res.json({ messsage: "post doesnt exists" });

            if (post.userId != req.user._id)
                return res.status(401).json({ messsage: "user is not authorized to this opertaion" });

            //delete from posts collection
            await Helper.deleteById(req.params.id);
            res.json({ message: "post deleted successfully" })

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "error while deleting the post" })
        }
    }
}
