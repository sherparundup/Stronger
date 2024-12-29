import productModel from "../model/ProductModel";
export const addProduct = async (req, res) => {
    try {
        const{name,description,price,countInStock,imageUrl,catagory}=req.body;
        const addProduct = new productModel({
            name,
            description,
            price,
            countInStock,
            imageUrl,
            catagory,
        });
        const isThereSameProduct = await productModel.findOne({name});
        if(isThereSameProduct){
            return res.status(400).json({success:false, message: "Product already exists"});
        }
        await addProduct.save();
        return res.status(200).json({success:true, message: "Product added successfully",product:addProduct});
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false, message: "Internal Server Error",error:error.message});
        
    }

}