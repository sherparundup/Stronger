import { HealthLog } from "../model/healthLog.model.js";
import { ApiResponse } from "../utils/util.api.response.js";

export const logHealthData = async (req, res) => {
    try {
      const { waterIntake, weight } = req.body;
      
      // Basic validation
      if (!waterIntake || !weight) {
        return res
          .status(400)
          .json(new ApiResponse(400, null, "Water intake and weight are required"));
      }
      
      // Create new health log entry
      const healthLog = await HealthLog.create({
        userId: req.user._id, // Assuming user is attached to req via auth middleware
        waterIntake,
        weight,
        date: new Date() // Will use current date as default
      });
      
      return res
        .status(201)
        .json(
          new ApiResponse(
            201, 
            healthLog, 
            "Health data logged successfully"
          )
        );
    } catch (error) {
      console.error("Error logging health data:", error);
      return res
        .status(500)
        .json(
          new ApiResponse(
            500, 
            null, 
            "Something went wrong while logging health data"
          )
        );
    }
  };
  
  export const getHealthLogs = async (req, res) => {
    try {
      // Get query parameters for pagination and date filtering
      const { 
        page = 1, 
        limit = 30,
        startDate,
        endDate,
        sort = "desc" // default to newest first
      } = req.query;
      
      // Create filter object
      const filter = {
        userId: req.user._id
      };
      
      // Add date range filter if provided
      if (startDate || endDate) {
        filter.date = {};
        
        if (startDate) {
          filter.date.$gte = new Date(startDate);
        }
        
        if (endDate) {
          filter.date.$lte = new Date(endDate);
        }
      }
      
      // Calculate pagination values
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const skip = (pageNum - 1) * limitNum;
      
      // Create sort configuration
      const sortConfig = { date: sort === "asc" ? 1 : -1 };
      
      // Fetch logs with pagination and sorting
      const logs = await HealthLog.find(filter)
        .sort(sortConfig)
        .skip(skip)
        .limit(limitNum);
        
      // Get total count for pagination info
      const totalLogs = await HealthLog.countDocuments(filter);
      
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            logs,
            pagination: {
              total: totalLogs,
              page: pageNum,
              limit: limitNum,
              pages: Math.ceil(totalLogs / limitNum)
            }
          },
          "Health logs retrieved successfully"
        )
      );
    } catch (error) {
      console.error("Error fetching health logs:", error);
      return res
        .status(500)
        .json(
          new ApiResponse(
            500,
            null,
            "Something went wrong while fetching health logs"
          )
        );
    }
  };