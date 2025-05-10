import { userModel } from "../model/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.util.js";
import ProgressPicture from "../model/progressPicture.model.js"
import { ApiResponse } from "../utils/util.api.response.js";
import TransformationModel from "../model/progressPicture.model.js"

export const getAllUser=async(req,res)=>{
    try {
        const allUser=await userModel.find();
        const count=allUser.length;
        return res.status(200).json({success:true,allUser,count:count});
    } catch (error) {
        
        return res.status(500).json({success:false,error:error.message});
    }


}
export const getUserByName=async(req,res)=>{
    try {
        const{name}=req.body;
        if(!name){
            return res.status(400).json({success:false,message:"Name is required"});
        }
        const user=await userModel.findOne({name});
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        return res.status(200).json({success:true,name:name,userFiltered:user});
        
    } catch (error) {
        return res.status(500).json({success:false,error:error.message});
        
    }
}




export const getAllTransformations = async (req, res) => {
  try {
    const transformations = await TransformationModel.find()
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });
    
      return res.status(200).json(new ApiResponse(200,transformations,'Transformations ' ));
    } catch (error) {
    console.error('Error fetching transformations:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get transformation by ID
export const getTransformationById = async (req, res) => {
  try {
    const {id}=req.params;
    const transformation = await TransformationModel.find({user:id})
      .populate('user', 'name avatar')
      .populate('comments.user', 'name avatar');
    
    if (!transformation) {
      return res.status(404).json(new ApiResponse(404,{},'Transformation not found' ));
    }
    
   return res.status(200).json(new ApiResponse(200,transformation,'Transformations ' ));
  } catch (error) {
    console.error('Error fetching transformation:', error);
    res.status(500).json(new ApiResponse(500,error.message, 'Server error' ));
  }
};

// Create a transformation post

export const createTransformation = async (req, res) => {
  try {
    const {user, title, caption, weightBefore, weightAfter, timePeriod, coach } = req.body;

    // Multer files: access like req.files.beforeImage[0] and req.files.afterImage[0]
    const beforeFile = req.files?.beforeImage?.[0];
    const afterFile = req.files?.afterImage?.[0];
    if (!beforeFile || !afterFile) {
      return res.status(400).json({ message: 'Both before and after images are required' });
    }

    // Upload to Cloudinary
    const beforeUpload = await uploadOnCloudinary(beforeFile.path);
    const afterUpload = await uploadOnCloudinary(afterFile.path);

    if (!beforeUpload || !afterUpload) {
      return res.status(500).json({ message: 'Image upload failed' });
    }

    // Create and save transformation
    const newTransformation = new TransformationModel({
      user,
      title,
      caption,
      beforeImage: beforeUpload.secure_url,
      afterImage: afterUpload.secure_url,
      weightBefore,
      weightAfter,
      timePeriod,
      coach, // Add coach field
    });

    await newTransformation.save();
    res.status(201).json(newTransformation);
  } catch (error) {
    console.error('Error creating transformation:', error);
    res.status(500).json(new ApiResponse(500, { error: error.message }, 'Server error'));
  }
};
export const getDetailedTransformation = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the transformation by ID and populate related fields
    const transformation = await TransformationModel.findById(id)
      .populate('user', 'name avatar') // Get user name and avatar
      .populate('coach', 'name avatar') // Get coach name and avatar if available
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'name avatar'
        }
      });
    
    if (!transformation) {
      return res.status(404).json(
        new ApiResponse(404, null, 'Transformation not found')
      );
    }
    
    // Update view count or any other metrics if needed
    // transformation.views = (transformation.views || 0) + 1;
    // await transformation.save();
    
    return res.status(200).json(
      new ApiResponse(200, transformation, 'Transformation retrieved successfully')
    );
  } catch (error) {
    console.error('Error fetching transformation details:', error);
    return res.status(500).json(
      new ApiResponse(500, null, 'Server error: ' + error.message)
    );
  }
};
// Delete a transformation
export const deleteTransformation = async (req, res) => {
  try {
    const transformation = await Transformation.findById(req.params.id);
    
    if (!transformation) {
      return res.status(404).json({ message: 'Transformation not found' });
    }
    
    // Check if user owns this transformation
    if (transformation.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete this transformation' });
    }
    
    await transformation.deleteOne();
    
    res.status(200).json({ message: 'Transformation removed' });
  } catch (error) {
    console.error('Error deleting transformation:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a comment to transformation
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    
    const transformation = await Transformation.findById(req.params.id);
    
    if (!transformation) {
      return res.status(404).json({ message: 'Transformation not found' });
    }
    
    const newComment = {
      user: req.user.id,
      text
    };
    
    transformation.comments.unshift(newComment);
    
    await transformation.save();
    
    // Populate user data before sending response
    await transformation.populate('comments.user', 'name avatar');
    
    res.status(201).json(transformation.comments);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Like/unlike a transformation
export const toggleLike = async (req, res) => {
  try {
    const transformation = await Transformation.findById(req.params.id);
    
    if (!transformation) {
      return res.status(404).json({ message: 'Transformation not found' });
    }
    
    // Check if already liked
    const likeIndex = transformation.likes.findIndex(
      like => like.toString() === req.user.id
    );
    
    if (likeIndex > -1) {
      // Unlike
      transformation.likes.splice(likeIndex, 1);
    } else {
      // Like
      transformation.likes.push(req.user.id);
    }
    
    await transformation.save();
    
    res.status(200).json(transformation.likes);
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ message: 'Server error' });
  }
};